'use client'

import { FiCopy, FiCheck } from 'react-icons/fi'
import { FaWhatsapp, FaLinkedin, FaXTwitter } from 'react-icons/fa6'
import { useState } from 'react'
import styles from './BlogShareRail.module.css'

type BlogShareRailProps = {
  url: string
  title: string
}

export function BlogShareRail({ url, title }: BlogShareRailProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const shareLinks = [
    {
      name: 'Share on WhatsApp',
      icon: FaWhatsapp,
      url: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
    },
    {
      name: 'Share on LinkedIn',
      icon: FaLinkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      name: 'Share on X',
      icon: FaXTwitter,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
  ]

  return (
    <div className={styles.shareRail}>
      <div className={styles.shareRailInner}>
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.shareButton}
            aria-label={link.name}
          >
            <link.icon size={20} />
          </a>
        ))}
        <button
          onClick={handleCopyLink}
          className={styles.shareButton}
          aria-label={copied ? 'Link copied' : 'Copy link'}
        >
          {copied ? <FiCheck size={20} /> : <FiCopy size={20} />}
        </button>
      </div>
    </div>
  )
}
