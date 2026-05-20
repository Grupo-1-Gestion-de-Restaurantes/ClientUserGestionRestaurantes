import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthImage from '../../../assets/img/auth-image.jpeg';
import ExpressLogo from '../../../assets/img/Express-ligth-2.png';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
import { Icon } from '../../../shared/components/ui/IconsFloats';

export const AuthPage = () => {
  const [currentView, setCurrentView] = useState('login');

  useEffect(() => {
    document.title = 'Acceder · Express';
  }, []);

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 15 : -15,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 15 : -15,
      opacity: 0,
      scale: 0.98,
    }),
  };

  const directionAnimation = currentView === 'register' ? 1 : -1;

  const floatingVariants = {
    animate: (i) => ({
      y: [0, Math.sin(i) * 60, Math.cos(i + 1) * -70, Math.sin(i * 2) * 50, 0],
      x: [0, Math.cos(i) * 60, Math.sin(i + 1) * 70, Math.cos(i * 2) * -50, 0],
      rotate: [0, 20, -15, 25, -10, 0],
      transition: {
        duration: 15 + (i % 4) * 4,
        ease: 'easeInOut',
        repeat: Infinity,
        delay: i * 0.3,
      },
    }),
    hover: {
      scale: 1.5,
      filter: 'saturate(2) brightness(1.3)',
      transition: { duration: 0.3 },
    },
  };

  const bgIcons = [
    { name: 'bread', style: { top: '10%', left: '5%' }, color: 'text-amber-700' },
    { name: 'cucumber', style: { bottom: '10%', left: '8%' }, color: 'text-green-600' },
    { name: 'chicken', style: { bottom: '5%', left: '40%' }, color: 'text-amber-600' },
    { name: 'potato', style: { top: '15%', left: '45%' }, color: 'text-orange-400' },
    { name: 'fish', style: { bottom: '55%', right: '10%' }, color: 'text-blue-500' },
    { name: 'knife', style: { top: '10%', right: '8%' }, color: 'text-gray-500' },
    { name: 'chili', style: { bottom: '45%', left: '15%' }, color: 'text-red-600' },
    { name: 'cheese', style: { bottom: '15%', right: '5%' }, color: 'text-yellow-500' },
  ];

  return (
    <div className="min-h-screen w-full bg-transparent text-white flex flex-row relative overflow-hidden">
      <div className="absolute inset-0 z-0 lg:hidden">
        <img
          src={AuthImage}
          alt="Auth Mobile Background"
          className="w-full h-full object-cover opacity-30 mask-[linear-gradient(to_bottom,black_40%,transparent_100%)] mix-blend-overlay"
        />
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 py-4 relative z-10 min-h-screen lg:h-screen lg:overflow-y-auto overflow-x-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {bgIcons.map((icon, i) => (
            <motion.div
              key={icon.name}
              custom={i}
              variants={floatingVariants}
              animate="animate"
              whileHover="hover"
              className={`absolute cursor-pointer pointer-events-auto opacity-40 sm:opacity-80 lg:opacity-100 ${icon.color} hover:brightness-125 drop-shadow-md`}
              style={icon.style}
            >
              <Icon
                name={icon.name}
                className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 transition-all duration-300"
              />
            </motion.div>
          ))}
        </div>

        <div className="w-full max-w-[480px] sm:max-w-[520px] mx-auto flex flex-col justify-center p-6 sm:p-8 bg-background-base/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.4)] relative z-10 lg:my-auto my-6">
          <div className="absolute -right-20 -top-14 z-50 pointer-events-auto hidden sm:block rotate-[30deg] cursor-pointer group">
            <Icon name="hatchief" className="h-40 w-40 animate-vibrate" />
          </div>

          <div className="mb-4 lg:mb-14 flex justify-center lg:justify-start">
            <img src={ExpressLogo} alt="Express Logo" className="w-20 lg:w-24 drop-shadow-lg" />
          </div>

          <div className="relative w-full grow grid items-center">
            <AnimatePresence mode="wait" custom={directionAnimation}>
              <motion.div
                key={currentView}
                custom={directionAnimation}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'tween', duration: 0.3, ease: 'easeOut' },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3, ease: 'easeInOut' },
                }}
                className="col-start-1 row-start-1 w-full"
              >
                {currentView === 'login' && (
                  <div className="w-full h-full flex flex-col justify-center">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center lg:text-left w-full leading-tight mb-5 drop-shadow-md">
                      Tu <span className="text-primary">antojo</span>, más <span className="text-secondary">cerca</span>.
                      <br />
                      Inicia sesión y pide en <span className="text-primary">segundos</span>.
                    </h1>
                    <LoginForm onSwitch={setCurrentView} />
                    
                    <div className="mt-6 flex justify-center lg:justify-start">
                      <a 
                        href="/" 
                        className="text-xs font-bangers tracking-[0.2em] text-on-base-faint hover:text-primary transition-colors flex items-center gap-2 group"
                      >
                        <span className="h-px w-4 bg-on-base-faint group-hover:bg-primary transition-colors" />
                        VOLVER AL INICIO
                      </a>
                    </div>
                  </div>
                )}

                {currentView === 'register' && (
                  <div className="w-full h-full flex flex-col justify-center">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center lg:text-left w-full leading-tight mb-5 drop-shadow-md">
                      Crea tu cuenta y <span className="text-secondary">ordena</span> sin filas.
                      <br />
                      Hoy se <span className="text-primary">come</span>.
                    </h1>
                    <RegisterForm onSwitch={setCurrentView} />
                  </div>
                )}

                {currentView === 'forgot' && (
                  <div className="w-full h-full flex flex-col justify-center">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center lg:text-left w-full leading-tight mb-5 drop-shadow-md">
                      ¿Se te fue la <span className="text-primary">clave</span>?
                      <br />
                      Te ayudamos a <span className="text-secondary">volver</span>.
                    </h1>
                    <ForgotPasswordForm onSwitch={setCurrentView} />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 p-6 h-screen sticky top-0">
        <div className="relative w-full h-full overflow-hidden rounded-2xl border border-white/5">
          <img
            src={AuthImage}
            alt="Auth Background"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-background-base/70 via-background-base/10 to-transparent mix-blend-overlay" />
        </div>
      </div>
    </div>
  );
};
