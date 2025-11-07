// composables/useVideoContent.ts
export const useVideoContent = () => {
  const videoConfig = {
    src: '/images/video.mp4',
    poster: '/images/video.mp4',
    alt: 'Tea brewing video'
  }

  return { videoConfig }
}