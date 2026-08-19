export async function applyWatermark(file: File, logoUrl: string = 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/37a0c0cf-0b35-45c9-84ca-b967aca3e2b6/logo-removebg-preview-1767874772753.png?width=1200&height=1200&resize=contain'): Promise<File> {  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Set canvas dimensions to image dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      // Ensure high quality drawing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw original image
      ctx.drawImage(img, 0, 0);

    // Load logo
    const logo = new Image();
    
    const applyLogo = (imgSrc: string) => {
      logo.src = imgSrc;
      logo.onload = () => {
        // Calculate logo size (e.g., 15% of image width)
        const logoWidth = canvas.width * 0.15;
        const logoHeight = (logo.height / logo.width) * logoWidth;

        // Position: Top Left with some padding
        const padding = canvas.width * 0.02;
        const x = padding;
        const y = padding;

        // No transparency for the watermark (100% clear)
        ctx.globalAlpha = 1.0;
        ctx.drawImage(logo, x, y, logoWidth, logoHeight);

        // Convert back to file
        canvas.toBlob((blob) => {
          if (blob) {
            const watermarkedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(watermarkedFile);
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, file.type, 1.0); // Use 1.0 quality for the blob
        
        URL.revokeObjectURL(img.src);
        if (imgSrc.startsWith('blob:')) {
          URL.revokeObjectURL(imgSrc);
        }
      };
      logo.onerror = () => {
        console.error('Failed to load watermark logo');
        resolve(file);
      };
    };

    // Try to fetch logo first to avoid CORS issues
    fetch(logoUrl, { mode: 'cors' })
      .then(res => res.blob())
      .then(blob => {
        applyLogo(URL.createObjectURL(blob));
      })
      .catch(err => {
        console.warn('CORS fetch failed, falling back to direct load', err);
        logo.crossOrigin = "anonymous";
        applyLogo(logoUrl + (logoUrl.includes('?') ? '&' : '?') + 't=' + Date.now());
      });
    };
  });
}
