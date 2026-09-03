'use client'

import { FiCopy, FiCheck } from 'react-icons/fi'
import { FaWhatsapp, FaLinkedin, FaXTwitter } from 'react-icons/fa6'
import { useState } from 'react'
import { track } from '../../lib/analytics'
import styles from './BlogShareRow.module.css'

type BlogShareRowProps = {
  url: string
  title: string
}

export function BlogShareRow({ url, title }: BlogShareRowProps) {
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

  const handleWhatsAppClick = () => {
    track('whatsapp_click', { location: 'blog_share_header' })
  }

  const shareLinks = [
    {
      name: 'Share on WhatsApp',
      icon: FaWhatsapp,
      url: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
      onClick: handleWhatsAppClick,
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
    <div className={styles.shareRow}>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.shareButton}
          aria-label={link.name}
          onClick={link.onClick}
        >
          <link.icon size={18} />
        </a>
      ))}
      <button
        onClick={handleCopyLink}
        className={styles.shareButton}
        aria-label={copied ? 'Link copied' : 'Copy link'}
      >
        {copied ? <FiCheck size={18} /> : <FiCopy size={18} />}
      </button>
    </div>
  )
}
