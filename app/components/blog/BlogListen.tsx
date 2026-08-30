'use client'

import { useState, useEffect, useRef } from 'react'
import { FiPlay, FiPause } from 'react-icons/fi'
import styles from './BlogListen.module.css'

type BlogListenProps = {
  content: string
  duration: number
}

export function BlogListen({ content, duration }: BlogListenProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true)
    }
  }, [])

  const handleToggle = () => {
    if (!isSupported) return

    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
    } else {
      const utterance = new SpeechSynthesisUtterance(content)
      utterance.rate = 1.0
      utterance.pitch = 1.0
      utterance.volume = 1.0

      utterance.onend = () => {
        setIsPlaying(false)
      }

      utterance.onerror = () => {
        setIsPlaying(false)
      }

      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
      setIsPlaying(true)
    }
  }

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  if (!isSupported) {
    return null
  }

  return (
    <button
      onClick={handleToggle}
      className={styles.listenButton}
      aria-label={isPlaying ? 'Pause article' : 'Listen to article'}
    >
      {isPlaying ? <FiPause size={16} /> : <FiPlay size={16} />}
      <span className={styles.listenLabel}>Listen</span>
      <span className={styles.listenDuration}>{duration} min</span>
    </button>
  )
}
