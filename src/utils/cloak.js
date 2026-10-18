export const CLOAK_CONFIGS = {
  default: {
    title: 'lgbtqiapluslearning',
    favicon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎮</text></svg>'
  },
  docs: {
    title: 'Unit 4 Research Notes - Google Docs',
    favicon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico'
  },
  classroom: {
    title: 'Classes - Google Classroom',
    favicon: 'https://ssl.gstatic.com/classroom/favicon.png'
  },
  canvas: {
    title: 'Dashboard - Canvas LMS',
    favicon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico'
  },
  drive: {
    title: 'My Drive - Google Drive',
    favicon: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png'
  }
};

export function applyCloak(option) {
  const config = CLOAK_CONFIGS[option] || CLOAK_CONFIGS.default;
  document.title = config.title;

  let link = document.querySelector("link[rel*='icon']");
  if (!link) {
    link = document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  link.href = config.favicon;
  localStorage.setItem('unblockzone_cloak', option);
}

export function getInitialCloak() {
  return localStorage.getItem('unblockzone_cloak') || 'default';
}
