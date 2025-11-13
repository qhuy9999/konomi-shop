/**
 * Composable for scroll animations using Intersection Observer
 * Auto-animate elements khi scroll tới
 * Support: Multiple animations với delay riêng từng selector
 */

interface AnimationConfig {
  threshold?: number;
  rootMargin?: string;
  delay?: number;
  once?: boolean; // Chỉ animate một lần hay lần nào scroll tới cũng animate
}

interface AnimationSetup {
  selector: string;
  animationClass: string;
  delay?: number; // Delay riêng cho animation này (override default)
  once?: boolean; // Override global once setting
}

export const useScrollAnimation = (config: AnimationConfig = {}) => {
  const {
    threshold = 0.1,
    rootMargin = "0px",
    delay = 0,
    once = false,
  } = config;

  /**
   * Animate single selector
   * @param selector - CSS selector to target
   * @param animationClass - Animation class name
   * @param customDelay - Delay riêng (ms). Nếu không set, dùng delay từ config
   * @param customOnce - Chỉ animate một lần hay không. Nếu không set, dùng once từ config
   */
  const animateOnScroll = (
    selector: string,
    animationClass: string,
    customDelay?: number,
    customOnce?: boolean
  ) => {
    // Guard: Chỉ chạy trên client (SSR check)
    if (typeof window === "undefined") return;

    const elements = document.querySelectorAll(selector);
    const effectiveDelay = customDelay ?? delay;
    const shouldObserveOnce = customOnce ?? once;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            // Add delay dựa trên index * effectiveDelay
            setTimeout(() => {
              entry.target.classList.add(animationClass);
            }, index * effectiveDelay);

            // Nếu once = true → unobserve (chỉ animate một lần)
            // Nếu once = false → giữ observer (animate mỗi lần scroll tới)
            if (shouldObserveOnce) {
              observer.unobserve(entry.target);
            }
          } else {
            // Khi scroll ra ngoài viewport → remove animation class (để animate lại khi scroll tới)
            if (!shouldObserveOnce) {
              entry.target.classList.remove(animationClass);
            }
          }
        });
      },
      { threshold, rootMargin }
    );

    elements.forEach((element) => {
      observer.observe(element);
    });
  };

  /**
   * Animate multiple selectors với delay config riêng từng cái
   * @param animations - Array of animation setup objects
   */
  const animateMultiple = (animations: AnimationSetup[]) => {
    // Guard: Chỉ chạy trên client (SSR check)
    if (typeof window === "undefined") return;

    animations.forEach(
      ({ selector, animationClass, delay: customDelay, once: customOnce }) => {
        const elements = document.querySelectorAll(selector);
        const effectiveOnce = customOnce ?? once;
        const effectiveDelay = customDelay ?? delay;

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry, index) => {
              if (entry.isIntersecting) {
                // Delay riêng từng selector (không stagger giữa các element)
                setTimeout(() => {
                  entry.target.classList.add(animationClass);
                }, effectiveDelay);

                if (effectiveOnce) {
                  observer.unobserve(entry.target);
                }
              } else {
                if (!effectiveOnce) {
                  entry.target.classList.remove(animationClass);
                }
              }
            });
          },
          { threshold, rootMargin }
        );

        elements.forEach((element) => {
          observer.observe(element);
        });
      }
    );
  };

  return { animateOnScroll, animateMultiple };
};
