const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} RateMyStore. All rights reserved.
        </p>
        <p className="text-slate-400 text-xs mt-2">
          Built with React, Express & Prisma
        </p>
      </div>
    </footer>
  );
};

export default Footer;
