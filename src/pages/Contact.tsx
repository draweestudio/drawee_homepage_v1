import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Mail, ArrowUpRight } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import Header from '../components/Header';

export default function Contact() {
  const { contact } = useSite();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/mdapoyaq', {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-primary selection:text-bg">
      {/* Header */}
      <Header />

      <main className="pt-40 pb-20 px-6 md:px-10 max-w-[1800px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium leading-[1.1] tracking-tight mb-6 whitespace-pre-line">
            {contact.title}
          </h1>
          {contact.description && (
            <p className="text-lg md:text-xl text-secondary max-w-2xl font-light leading-relaxed whitespace-pre-line mb-12">
              {contact.description}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-20">
            {/* Contact Info */}
            <div className="space-y-12">
              <div>
                <h2 className="text-sm font-medium text-secondary mb-4 uppercase tracking-wider">Email</h2>
                <a href={`mailto:${contact.email}`} className="text-2xl md:text-3xl font-medium hover:text-secondary transition-colors inline-flex items-center gap-2">
                  {contact.email} <ArrowUpRight className="w-6 h-6" />
                </a>
              </div>

              <div>
                {contact.location && contact.location.trim() !== '' && (
                  <>
                    <h2 className="text-sm font-medium text-secondary mb-4 uppercase tracking-wider">Location</h2>
                    <p className="text-xl leading-relaxed whitespace-pre-line">
                      {contact.location}
                    </p>
                  </>
                )}
              </div>

              <div>
                {contact.socials && contact.socials.length > 0 && (
                  <>
                    <h2 className="text-sm font-medium text-secondary mb-4 uppercase tracking-wider">Social</h2>
                    <div className="flex gap-6 flex-wrap">
                      {contact.socials.map((social: any) => (
                        <a key={social.id} href={social.url} target="_blank" rel="noreferrer" className="text-lg hover:text-secondary transition-colors">
                          {social.platform}
                        </a>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 p-8 md:p-12 rounded-2xl">
              <h2 className="text-2xl font-medium mb-8">프로젝트 문의하기</h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium mb-2">이름 / 회사명</label>
                  <input type="text" name="name" required className="w-full bg-transparent border-b border-gray-300 py-3 focus:outline-none focus:border-primary transition-colors" placeholder="홍길동 / (주)드로이" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">이메일</label>
                  <input type="email" name="email" required className="w-full bg-transparent border-b border-gray-300 py-3 focus:outline-none focus:border-primary transition-colors" placeholder="hello@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">프로젝트 내용</label>
                  <textarea name="message" required rows={4} className="w-full bg-transparent border-b border-gray-300 py-3 focus:outline-none focus:border-primary transition-colors resize-none" placeholder="프로젝트에 대해 간단히 설명해 주세요."></textarea>
                </div>
                <button type="submit" disabled={status === 'submitting'} className="w-full bg-primary text-bg py-4 rounded-lg font-medium hover:bg-opacity-90 transition-colors mt-8 disabled:opacity-50">
                  {status === 'submitting' ? '전송 중...' : '문의 보내기'}
                </button>
                {status === 'success' && (
                  <p className="text-green-600 text-sm mt-4 text-center">성공적으로 전송되었습니다. 곧 연락드리겠습니다!</p>
                )}
                {status === 'error' && (
                  <p className="text-red-600 text-sm mt-4 text-center">전송에 실패했습니다. 잠시 후 다시 시도해 주세요.</p>
                )}
              </form>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
