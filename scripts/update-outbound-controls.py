import json, urllib.request, pathlib, os, sys, datetime, copy
# Run on BDR host. Reads key in place; never prints it. Default is review only.
APPLY='--apply' in sys.argv
E={}
for line in open('/var/www/goproxe/.env.local'):
 k,s,v=line.strip().partition('=')
 if s:E[k]=v.strip().strip(chr(34)).strip(chr(39))
def api(p,body=None):
 req=urllib.request.Request('https://api.elevenlabs.io/v1/convai'+p,headers={'xi-api-key':E['ELEVENLABS_API_KEY'],'Content-Type':'application/json'},data=json.dumps(body).encode() if body is not None else None,method='PATCH' if body is not None else 'GET')
 return json.load(urllib.request.urlopen(req,timeout=30))
IDS=['agent_9901m0sn70f1ejn84enhccrns2kt','agent_8901m0sn6y14eegsqh7mmgdswm92','agent_1201m0sn71mvf3arwzfwv4h9s2v1']
POLICY='''OUTBOUND CALL CONTROL V2, ARC REVIEW ONLY
These rules govern this outbound call. They do not apply to website callback agents.
PRIORITY: goodbye, stop, refusal or cannot talk means END NOW. This overrides all instructions to ask a question, request a time, pitch or offer a demo. Use end_call with the farewell in its message; do not separately speak the same farewell first. If a farewell was already spoken, end_call must not repeat it.
If they ask for WhatsApp or details and cannot talk, say only through end_call: "I have noted your request for details. Thank you, goodbye." Do not ask a callback question or redirect them. If they ask for a callback AND give a time, include that exact time once in the end_call farewell, without another question.
- Silence is not consent or interest. After the first silence ask "Are you still there?" once. If the next turn is silence, invoke end_call with reason="no_answer" and one short goodbye. Never repeat the goodbye or restart the pitch. The close does not require a question.
- If you hear a phone menu ("press one"), voicemail greeting, "record your message", or an unavailable-number recording, invoke end_call immediately with reason="automated_answer". Do not pitch to it or keep interrupting its menu.
- When someone says goodbye, refuses, asks to stop, says wrong number, or ends the conversation, acknowledge briefly and invoke end_call. Never wait for them to hang up. Do not send a follow-up message after silence, voicemail, refusal or wrong number.
- If busy or requesting a callback, stop qualification and the pitch immediately. If no time was given, ask once for their preferred day and time. Repeat their stated preference once, including any range. Say "Thank you, I have noted your preferred time for review." Then invoke end_call with reason="callback_requested". Do not invent tomorrow, interpret afternoon as a booking, or promise a scheduled callback. Their request is retained in ARC's transcript for review.
- Information or WhatsApp requests: acknowledge that details were requested and will be reviewed. Do not promise to send anything now. No outbound WhatsApp, email, calendar, PROXe handoff or automated sequence is enabled. Do not call send_oncall_whatsapp, give a WhatsApp number, or redirect them to message PROXe. Nothing leaves ARC until a person qualifies and explicitly hands off the prospect.
- If they want a demo, ask once for a preferred day/time, repeat it once, and describe it as a request for review. Never claim it is booked or that an invite or details were sent. Once captured, invoke end_call with reason="demo_requested". A yes to thirty seconds is only permission to explain, not agreement to a demo.
- Ask one question at a time. Answer their question first. A correction to their name, company or time replaces your earlier assumption. Do not insist on incorrect imported data. If the business is wrong, end politely for review.
- With reception, ask for whoever handles enquiries; do not assume reception is the decision maker. If unavailable, capture a preferred callback time and end.
- A completed call, silence or an IVR is never a qualified lead. Qualification and handoff happen later in ARC. Avoid repeating a sentence after interruptions; respond to the new information.
'''
REMOVE=('IF THEY DO NOT REMEMBER YOU','IF THEY GO SILENT','IF THEY SAY YES','ORDER OF THE CLOSE','ASK FOR THE DEMO ONCE','WRAP UP:','IF send_oncall_whatsapp','PROMISES:','EXIT:')
for aid in IDS:
 d=api('/agents/'+aid); c=d['conversation_config']; p=c['agent']['prompt']; old=p['prompt']
 if old.startswith('OUTBOUND CALL CONTROL V2, ARC REVIEW ONLY'):
  assert c['turn']['silence_end_call_timeout']==12
  assert p['built_in_tools']['end_call'] and not p.get('tool_ids')
  assert all(t.get('name')=='end_call' for t in p.get('tools',[]))
  print(d['name']+': already updated and verified');continue
 if old.startswith('OUTBOUND CALL CONTROL, ARC REVIEW ONLY'):
  old=old.split('\n\n',1)[1]
 parts=[x for x in old.split('\n\n') if not x.startswith(REMOVE)]
 text='\n\n'.join(parts)
 text=text.replace('Every turn ENDS IN A QUESTION, then you stop and wait. A statement with no question leaves dead air; never end a turn without a question.','Ask one question per discovery turn, then wait. Closing turns invoke end_call and never ask another question.')
 text=text.replace('offer WhatsApp','note their preferred callback time').replace('OR offer WhatsApp','OR note their preferred callback time')
 text=text.replace('If you have nothing to add, ask your next question.','If the conversation is finished, invoke end_call.')
 text=text.replace('always offer two concrete slots','ask for a preferred day and time')
 assert '{{wa_number}}' not in text
 tools=p.get('tools') or []
 assert all(t.get('name') in ['send_oncall_whatsapp','end_call'] for t in tools), 'Unexpected tools: review before modifying'
 built=copy.deepcopy(p.get('built_in_tools') or {})
 built['end_call']={'type':'system','name':'end_call','description':'End immediately after a closing line, a second silence, an automated menu/voicemail, refusal, wrong number, or a captured callback/demo request. Do not reopen the conversation.','params':{'system_tool_type':'end_call'}}
 patch={'conversation_config':{'turn':{'silence_end_call_timeout':12},'agent':{'prompt':{'prompt':POLICY+'\n\n'+text,'tools':[],'tool_ids':[],'built_in_tools':built}}},'platform_settings':{'data_collection':{
  'call_outcome':{'type':'string','description':'Use only caller evidence: no_answer for silence or automated menu/voicemail; callback for a requested later call; wrong_number; not_interested for refusal; interested for explicit product/demo interest; otherwise connected. A yes to the opener alone is connected. Never qualified or booked.'},
  'callback_request':{'type':'string','description':'Exact caller-requested callback or demo day/time/range, retaining uncertainty. Empty string if none. Do not invent a date or claim a booking.'}
 }}}
 print(json.dumps({'agent':d['name'],'voice_preserved':True,'model_preserved':True,'prompt_chars':len(patch['conversation_config']['agent']['prompt']['prompt']),'silence_timeout':12,'end_call':True,'outbound_send_tools_removed':True,'apply':APPLY}))
 if APPLY:
  folder=pathlib.Path('/root/proxe-call-controls-backups');folder.mkdir(mode=0o700,exist_ok=True)
  backup=folder/(aid+'-'+datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ')+'.json')
  backup.write_text(json.dumps(d,indent=2));os.chmod(backup,0o600)
  api('/agents/'+aid,patch);after=api('/agents/'+aid);ac=after['conversation_config']
  assert ac['tts']==c['tts'] and ac['asr']==c['asr']
  for k,v in p.items():
   if k not in ['prompt','tools','tool_ids','built_in_tools']:assert ac['agent']['prompt'].get(k)==v,k
  assert ac['agent']['first_message']==c['agent']['first_message']
  assert ac['turn']['silence_end_call_timeout']==12
  assert ac['agent']['prompt']['built_in_tools']['end_call']
  assert not ac['agent']['prompt'].get('tool_ids') and all(t.get('name')=='end_call' for t in ac['agent']['prompt'].get('tools',[]))
  print(d['name']+': read-back verified')
