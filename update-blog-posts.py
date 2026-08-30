#!/usr/bin/env python3
"""
Batch update remaining blog posts to use BlogPostWrapper.
Preserves all body content, updates only the wrapper structure.
"""

import re
import os

# Posts to update (clinics already done)
POSTS = [
    'after-hours-whatsapp',
    'coaching-parents-at-night',
    'crm-wont-answer',
    'home-services-on-a-job',
    'how-fast-to-reply-whatsapp',
    'not-a-whatsapp-bot',
    'one-memory-every-channel',
    'paid-lead-no-reply',
    'people-miss-conversations',
    'professional-services-with-a-client',
    'wellness-after-hours',
    'what-is-proxe',
]

def extract_content_sections(content):
    """Extract the main body sections between <BlogToc> and footer"""
    # Find content between BlogToc and the Related/Recent/Prev-Next sections
    match = re.search(
        r'<BlogToc items=\{tocItems\} />(.*?)(\/\* Related Posts \*\/)',
        content,
        re.DOTALL
    )
    if match:
        return match.group(1).strip()
    return None

def extract_article_text(content):
    """Extract plain text for Listen feature"""
    # Remove JSX tags and get first ~500 words
    text = re.sub(r'<[^>]+>', '', content)
    text = re.sub(r'\{[^}]+\}', '', text)
    text = re.sub(r'\s+', ' ', text)
    words = text.split()[:100]
    return ' '.join(words)

def update_post(slug):
    """Update a single blog post to use BlogPostWrapper"""
    filepath = f'/workspace/app/blog/{slug}/page.tsx'
    
    if not os.path.exists(filepath):
        print(f"❌ {slug}: File not found")
        return False
    
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Check if already updated
    if 'BlogPostWrapper' in content:
        print(f"⏭️  {slug}: Already updated")
        return True
    
    # Extract key parts
    metadata_match = re.search(r'export const metadata.*?\n\}', content, re.DOTALL)
    faq_schema_match = re.search(r'const faqSchema = \{.*?\n\}', content, re.DOTALL)
    page_title_match = re.search(r"const pageTitle = '([^']+)'", content)
    page_url_match = re.search(r"const pageUrl = '([^']+)'", content)
    toc_items_match = re.search(r'const tocItems = \[(.*?)\]', content, re.DOTALL)
    body_content = extract_content_sections(content)
    
    if not all([metadata_match, page_title_match, page_url_match, toc_items_match, body_content]):
        print(f"❌ {slug}: Could not extract required parts")
        return False
    
    metadata = metadata_match.group(0)
    page_title = page_title_match.group(1)
    page_url = page_url_match.group(1)
    toc_items = toc_items_match.group(0)
    faq_schema = faq_schema_match.group(0) if faq_schema_match else None
    
    # Add og:image to metadata if not present
    if 'openGraph' not in metadata:
        metadata = metadata.replace(
            '  },\n}',
            f"  }},\n  openGraph: {{\n    images: ['/blog/{slug}.png'],\n  }},\n}}"
        )
    
    # Generate article content for Listen
    article_text = extract_article_text(body_content[:2000])
    
    # Build new file
    new_content = f"""import type {{ Metadata }} from 'next'
import {{ BlogPostWrapper }} from '../../components/blog/BlogPostWrapper'
import styles from '../../styles/legal.module.css'

{metadata}

const articleContent = `{article_text}`

"""
    
    if faq_schema:
        new_content += f"{faq_schema}\n\n"
    
    # Extract function name
    func_name_match = re.search(r'export default function (\w+)', content)
    func_name = func_name_match.group(1) if func_name_match else f'{slug.replace("-", " ").title().replace(" ", "")}Page'
    
    new_content += f"""export default function {func_name}() {{
  const slug = '{slug}'
  const pageUrl = '{page_url}'
  const pageTitle = '{page_title}'

  {toc_items}

"""
    
    if faq_schema:
        new_content += "  const jsonLdSchemas = [faqSchema]\n"
    else:
        new_content += "  const jsonLdSchemas = []\n"
    
    new_content += f"""
  return (
    <BlogPostWrapper
      slug={{slug}}
      title={{pageTitle}}
      pageUrl={{pageUrl}}
      tocItems={{tocItems}}
      articleContent={{articleContent}}
      jsonLdSchemas={{jsonLdSchemas}}
    >
      {body_content}
    </BlogPostWrapper>
  )
}}
"""
    
    # Write updated content
    with open(filepath, 'w') as f:
        f.write(new_content)
    
    print(f"✅ {slug}: Updated successfully")
    return True

def main():
    print("Updating remaining blog posts...\n")
    success = 0
    failed = 0
    
    for slug in POSTS:
        if update_post(slug):
            success += 1
        else:
            failed += 1
    
    print(f"\n{'='*50}")
    print(f"✅ Success: {success}")
    print(f"❌ Failed: {failed}")
    print(f"{'='*50}")

if __name__ == '__main__':
    main()
