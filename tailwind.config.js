/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#FDFBF7', // 미색 종이 배경
          cream: '#FAF8F5', // 크림 톤 배경 (카드/패널)
          line: '#EAE5DC', // 원고지 줄 / 은은한 구분선
        },
        ink: {
          DEFAULT: '#2C2C2C', // 본문 텍스트 (부드러운 먹색)
          soft: '#6B675F', // 보조 텍스트
        },
        accent: {
          indigo: '#5B6B8C', // 은은한 인디고 블루
          green: '#6B8A6E', // 차분한 그린 (대안 포인트)
        },
      },
      fontFamily: {
        // 바탕체/명조체 계열 서체 스택 (Serif)
        serif: [
          '"Noto Serif KR"',
          '"Nanum Myeongjo"',
          '"Batang"',
          'ui-serif',
          'Georgia',
          'serif',
        ],
      },
      boxShadow: {
        // 아주 부드럽고 은은한 그림자
        paper: '0 2px 12px rgba(44, 44, 44, 0.06)',
        card: '0 1px 6px rgba(44, 44, 44, 0.05)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'pop-in': 'pop-in 0.35s ease-out',
      },
    },
  },
  plugins: [],
}
