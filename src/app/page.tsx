'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Environment, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Github, Linkedin, Mail, Download, ExternalLink, Code, Database, Globe, Cpu, Zap, Sparkles, Rocket } from 'lucide-react';

// 3D Character Component with enhanced interactions
function AnimatedCharacter({ mousePosition, onGameMode }: { mousePosition: { x: number; y: number }; onGameMode: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [characterMood, setCharacterMood] = useState('happy');

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x = mousePosition.y * 0.15;
      meshRef.current.rotation.y = mousePosition.x * 0.15;
    }
  }, [mousePosition]);

  const handleClick = (e: any) => {
    e.stopPropagation();
    setClickCount(prev => {
      const newCount = prev + 1;
      setIsWaving(true);
      setCharacterMood('excited');
      setTimeout(() => {
        setIsWaving(false);
        setCharacterMood('happy');
      }, 1000);

      // Easter egg: activate game mode after 5 clicks
      if (newCount >= 5) {
        onGameMode();
        return 0; // Reset click count
      }
      
      return newCount;
    });
  };

  const getCharacterColor = () => {
    if (characterMood === 'excited') return '#3b82f6';
    if (isHovered) return '#06b6d4';
    return '#1e40af';
  };

  return (
    <group onClick={handleClick}>
      <Float speed={2} rotationIntensity={0.8} floatIntensity={0.8}>
        {/* Main Body */}
        <mesh
          ref={meshRef}
          onPointerOver={() => {
            setIsHovered(true);
            setCharacterMood('curious');
          }}
          onPointerOut={() => {
            setIsHovered(false);
            setCharacterMood('happy');
          }}
          scale={isHovered ? 1.15 : 1}
        >
          <boxGeometry args={[2, 2.5, 1]} />
          <MeshDistortMaterial
            color={getCharacterColor()}
            emissive={getCharacterColor()}
            emissiveIntensity={0.3}
            distort={0.3}
            speed={2}
            roughness={0.2}
          />
        </mesh>

        {/* Head */}
        <mesh position={[0, 2, 0]}>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshStandardMaterial
            color="#fdbcb4"
            emissive="#fdbcb4"
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Animated Eyes */}
        <mesh position={[-0.3, 2.1, 0.7]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#000" />
        </mesh>
        <mesh position={[0.3, 2.1, 0.7]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#000" />
        </mesh>

        {/* Eye sparkles when excited */}
        {characterMood === 'excited' && (
          <>
            <mesh position={[-0.25, 2.15, 0.8]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={1} />
            </mesh>
            <mesh position={[0.35, 2.15, 0.8]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={1} />
            </mesh>
          </>
        )}

        {/* Animated Arms */}
        <mesh
          position={[-1.2, 0.5, 0]}
          rotation={isWaving ? [0, 0, -Math.PI / 3] : [0, 0, 0]}
        >
          <boxGeometry args={[0.3, 1.5, 0.3]} />
          <meshStandardMaterial color="#fdbcb4" />
        </mesh>
        <mesh
          position={[1.2, 0.5, 0]}
          rotation={isWaving ? [0, 0, Math.PI / 3] : [0, 0, 0]}
        >
          <boxGeometry args={[0.3, 1.5, 0.3]} />
          <meshStandardMaterial color="#fdbcb4" />
        </mesh>

        {/* Click indicators */}
        {clickCount > 0 && (
          <group position={[0, 3.5, 0]}>
            {Array.from({ length: clickCount }).map((_, i) => (
              <mesh
                key={i}
                position={[
                  Math.sin((i / clickCount) * Math.PI * 2) * 0.5,
                  Math.cos((i / clickCount) * Math.PI * 2) * 0.5,
                  0
                ]}
              >
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshStandardMaterial
                  color="#fbbf24"
                  emissive="#fbbf24"
                  emissiveIntensity={0.8}
                />
              </mesh>
            ))}
          </group>
        )}

        {/* Floating particles around character */}
        {isHovered && (
          <group>
            {Array.from({ length: 6 }).map((_, i) => (
              <mesh
                key={i}
                position={[
                  Math.sin((i / 6) * Math.PI * 2) * 2,
                  Math.cos((i / 6) * Math.PI * 2) * 2,
                  Math.sin((Date.now() * 0.001 + i) * 0.5)
                ]}
              >
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshStandardMaterial
                  color="#06b6d4"
                  emissive="#06b6d4"
                  emissiveIntensity={1}
                />
              </mesh>
            ))}
          </group>
        )}
      </Float>
    </group>
  );
}

// Enhanced 3D Skill Orb Component
function SkillOrb({ skill, position, index }: { skill: any; position: [number, number, number]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (meshRef.current && isClient) {
      meshRef.current.rotation.x = Date.now() * 0.001 * (index + 1);
      meshRef.current.rotation.y = Date.now() * 0.001 * (index + 1);
    }
  }, [index, isClient]);

  const getCategoryColor = (category: string) => {
    const colors = {
      'Languages': '#3b82f6',
      'Frontend': '#06b6d4',
      'Backend': '#1e40af',
      'Databases': '#059669',
      'Tools': '#d97706'
    };
    return colors[category as keyof typeof colors] || '#1e40af';
  };

  return (
    <Float speed={1 + index * 0.2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group position={position}>
        <mesh
          ref={meshRef}
          onPointerOver={() => setIsHovered(true)}
          onPointerOut={() => setIsHovered(false)}
          scale={isHovered ? 1.3 : 1}
        >
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={getCategoryColor(skill.category)}
            emissive={getCategoryColor(skill.category)}
            emissiveIntensity={isHovered ? 0.8 : 0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Skill label */}
        <mesh position={[0, 0, 1.5]}>
          <planeGeometry args={[3, 0.8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
        </mesh>

        {/* Orbiting particles */}
        {isHovered && isClient && (
          <group>
            {Array.from({ length: 4 }).map((_, i) => (
              <mesh
                key={i}
                position={[
                  Math.sin((Date.now() * 0.002 + i * Math.PI / 2)) * 2,
                  Math.cos((Date.now() * 0.002 + i * Math.PI / 2)) * 2,
                  0
                ]}
              >
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshStandardMaterial
                  color={getCategoryColor(skill.category)}
                  emissive={getCategoryColor(skill.category)}
                  emissiveIntensity={1}
                />
              </mesh>
            ))}
          </group>
        )}
      </group>
    </Float>
  );
}

// Enhanced Particle Effect
function ParticleEffect() {
  const particlesRef = useRef<THREE.Points>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (particlesRef.current && isClient) {
      const particles = particlesRef.current;
      const positions = particles.geometry.attributes.position.array as Float32Array;

      const animate = () => {
        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 1] += Math.sin(Date.now() * 0.001 + i) * 0.01;
          positions[i] += Math.cos(Date.now() * 0.001 + i) * 0.005;
        }
        particles.geometry.attributes.position.needsUpdate = true;
      };

      const interval = setInterval(animate, 16);
      return () => clearInterval(interval);
    }
  }, [isClient]);

  if (!isClient) {
    return null;
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(6000).map(() => (Math.random() - 0.5) * 30), 3]}
          count={2000}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.6} />
    </points>
  );
}

export default function Portfolio() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [isGameMode, setIsGameMode] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [gameTargets, setGameTargets] = useState<{ id: number; position: [number, number, number] }[]>([]);
  const [activeSection, setActiveSection] = useState('home');
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const textY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -50]), { stiffness: 100, damping: 20 });

  const startGameMode = () => {
    console.log('Starting game mode');
    setIsGameMode(true);
    setGameScore(0);
    generateGameTargets();
  };

  const endGameMode = () => {
    setIsGameMode(false);
    setGameTargets([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage('Message sent successfully! I\'ll get back to you soon.');
        setFormData({ name: '', email: '', message: '' }); // Reset form
      } else {
        setSubmitStatus('error');
        setSubmitMessage(data.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateGameTargets = () => {
    const targets = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 5
      ] as [number, number, number]
    }));
    setGameTargets(targets);
  };

  const handleTargetClick = (targetId: number) => {
    console.log('Target clicked:', targetId);
    setGameTargets(prev => {
      const newTargets = prev.filter(t => t.id !== targetId);
      console.log('Remaining targets:', newTargets.length);
      
      // Update score
      setGameScore(prevScore => {
        const newScore = prevScore + 10;
        console.log('Score updated from', prevScore, 'to', newScore);
        
        // Check if game is over
        if (newTargets.length === 0) {
          setTimeout(() => {
            alert(`Game Over! Your score: ${newScore}`);
            endGameMode();
          }, 100);
        }
        
        return newScore;
      });
      
      return newTargets;
    });
  };

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
      const sections = ['home', 'skills', 'projects', 'about', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [gameTargets.length, gameScore]);

  const skills = [
    { name: 'C', category: 'Languages', level: 'Advanced' },
    { name: 'C++', category: 'Languages', level: 'Advanced' },
    { name: 'Java', category: 'Languages', level: 'Intermediate' },
    { name: 'Python', category: 'Languages', level: 'Advanced' },
    { name: 'JavaScript', category: 'Languages', level: 'Advanced' },
    { name: 'TypeScript', category: 'Languages', level: 'Advanced' },
    { name: 'HTML', category: 'Frontend', level: 'Expert' },
    { name: 'CSS', category: 'Frontend', level: 'Expert' },
    { name: 'ReactJS', category: 'Frontend', level: 'Advanced' },
    { name: 'NextJS', category: 'Frontend', level: 'Advanced' },
    { name: 'NodeJS', category: 'Backend', level: 'Advanced' },
    { name: 'ExpressJS', category: 'Backend', level: 'Advanced' },
    { name: 'SQL', category: 'Databases', level: 'Intermediate' },
    { name: 'MongoDB', category: 'Databases', level: 'Advanced' },
    { name: 'Git', category: 'Tools', level: 'Advanced' },
    { name: 'GitHub', category: 'Tools', level: 'Advanced' },
    { name: 'Docker', category: 'Tools', level: 'Intermediate' },
    { name: 'APIs', category: 'Tools', level: 'Expert' },
  ];

  const projects = [
    {
      title: 'NotesAura',
      description: 'An AI-powered note generator that creates notes from PDFs, PPTs, audio, and text files.',
      tech: ['AI', 'React', 'Node.js', 'Python', 'Machine Learning'],
      github: '#',
      demo: '#',
      featured: true,
    },
    {
      title: 'Personal Portfolio',
      description: 'A modern, responsive portfolio site showcasing my journey and skills with 3D interactions.',
      tech: ['React', 'Three.js', 'Framer Motion', 'Next.js', 'TypeScript'],
      github: '#',
      demo: '#',
      featured: true,
    },
    {
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with payment integration and admin dashboard.',
      tech: ['MERN', 'Stripe', 'Redux', 'Tailwind'],
      github: '#',
      demo: '#',
      featured: false,
    },
  ];

  const timeline = [
    { year: '2022', title: 'Started Loving DSA', description: 'Discovered my passion for Data Structures and Algorithms', icon: '🧮' },
    { year: '2023', title: 'Started B.Tech CSE', description: 'Began my journey in Computer Science Engineering', icon: '🎓' },
    { year: '2024', title: 'Full Stack Discovery', description: 'Found my passion for both frontend and backend development', icon: '💻' },
    { year: '2025', title: 'AI & ML Integration', description: 'Started exploring AI and machine learning applications', icon: '🤖' },
  ];

  const navItems = [
    { id: 'home', label: 'Home', icon: Rocket },
    { id: 'skills', label: 'Skills', icon: Zap },
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'about', label: 'About', icon: Globe },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white overflow-hidden select-none">
      {/* Fixed Bottom Navigation */}
      <motion.nav
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-fit mx-auto">
          <motion.div
            className="flex justify-center items-center gap-2 p-4 rounded-full bg-gray-900/95 backdrop-blur-lg border border-gray-700/50 shadow-2xl pointer-events-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {navItems.map((item) => (
              <motion.a
                key={item.id}
                href={`#${item.id}`}
                className={`relative px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 select-none ${activeSection === item.id
                    ? 'bg-gray-700 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-cyan-900/20 to-gray-900/20" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" />
          <div className="absolute top-40 right-20 w-72 h-72 bg-cyan-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000" />
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-gray-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000" />
        </div>

        <div className="relative z-10 pointer-events-none">
          {isClient && (
            <Canvas camera={{ position: [0, 0, 10], fov: 50 }} className="pointer-events-auto">
              <Environment preset="night" />
              <ambientLight intensity={0.3} />
              <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
              <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" />
              <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
              <AnimatedCharacter mousePosition={mousePosition} onGameMode={startGameMode} />
              <ParticleEffect />

              {/* Game Mode Targets */}
              {isGameMode && gameTargets.map((target) => (
                <mesh
                  key={target.id}
                  position={target.position}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTargetClick(target.id);
                  }}
                >
                  <sphereGeometry args={[0.5, 16, 16]} />
                  <meshStandardMaterial
                    color="#fbbf24"
                    emissive="#fbbf24"
                    emissiveIntensity={0.8}
                    metalness={0.8}
                    roughness={0.2}
                  />
                </mesh>
              ))}

              <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>
          )}
        </div>

        {/* Game Mode UI */}
        <AnimatePresence>
          {isGameMode && (
            <motion.div
              className="absolute top-32 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-2xl shadow-2xl pointer-events-auto">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="animate-pulse" />
                  Game Mode! Score: {gameScore}
                </h3>
                <p className="text-sm mt-1">Click the golden orbs!</p>
              </div>
              <motion.button
                className="mt-4 px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors mx-auto block pointer-events-auto"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={endGameMode}
              >
                Exit Game
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-6 pointer-events-none"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-gray-400 bg-clip-text text-transparent select-none"
            style={{ y: textY }}
          >
            Hi, I'm Advay Sharma 👋
          </motion.h1>
          <motion.h2
            className="text-3xl md:text-5xl mb-6 text-gray-200 font-semibold select-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Full Stack Developer & Creative Technologist
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-gray-300 leading-relaxed select-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            I love building creative digital experiences, crafting powerful full-stack applications,
            and exploring the intersection of AI, web development, and immersive technologies.
          </motion.p>
          <motion.p
            className="text-sm text-gray-400 mb-8 flex items-center gap-2 select-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Zap className="text-yellow-400" />
            Click the character 5 times to activate game mode!
          </motion.p>
          <motion.div
            className="flex gap-6 flex-wrap justify-center pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all select-none"
              whileHover={{ scale: 1.05, rotateY: 10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View My Work
            </motion.button>
            <motion.button
              className="px-8 py-4 border-2 border-blue-500 rounded-full font-semibold text-lg hover:bg-blue-600 hover:text-white transition-all hover:shadow-lg hover:shadow-blue-500/25 select-none"
              whileHover={{ scale: 1.05, rotateY: -10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Contact Me
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Enhanced Skills Section */}
      <section id="skills" className="min-h-screen py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/20" />

        <motion.div
          className="max-w-7xl mx-auto relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h2
            className="text-5xl md:text-6xl font-bold text-center mb-20 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
            initial={{ y: 50 }}
            whileInView={{ y: 0 }}
          >
            Skills & Expertise
          </motion.h2>

          {/* 3D Skills Visualization */}
          <div className="h-96 mb-20 relative">
            {isClient && (
              <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
                <Environment preset="night" />
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" />
                <Stars radius={50} depth={20} count={2000} factor={3} saturation={0} fade />

                {skills.map((skill, index) => {
                  const angle = (index / skills.length) * Math.PI * 2;
                  const radius = 8;
                  const x = Math.cos(angle) * radius;
                  const z = Math.sin(angle) * radius;
                  const y = Math.sin(index * 0.3) * 3;

                  return (
                    <SkillOrb
                      key={skill.name}
                      skill={skill}
                      position={[x, y, z] as [number, number, number]}
                      index={index}
                    />
                  );
                })}

                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.3} />
              </Canvas>
            )}
          </div>

          {/* Skills Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {['Languages', 'Frontend', 'Backend', 'Databases', 'Tools'].map((category) => (
              <motion.div
                key={category}
                className="p-6 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 hover:border-blue-500/50 transition-all duration-300"
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)',
                  y: -5
                }}
              >
                <motion.h3
                  className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.1 }}
                >
                  {category}
                </motion.h3>
                <div className="space-y-4">
                  {skills.filter(skill => skill.category === category).map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                      whileHover={{ x: 10 }}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse" />
                        <span className="font-medium">{skill.name}</span>
                      </div>
                      <span className="text-sm text-gray-400 bg-white/10 px-2 py-1 rounded-full">
                        {skill.level}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="min-h-screen py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent" />

        <motion.div
          className="max-w-7xl mx-auto relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h2
            className="text-5xl md:text-6xl font-bold text-center mb-20 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
            initial={{ y: 50 }}
            whileInView={{ y: 0 }}
          >
            Featured Projects
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                className={`group relative p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 overflow-hidden hover:border-blue-500/50 transition-all duration-300 ${project.featured ? 'md:col-span-2 lg:col-span-1' : ''
                  }`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  boxShadow: '0 30px 60px rgba(59, 130, 246, 0.4)'
                }}
              >
                {project.featured && (
                  <motion.div
                    className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full text-xs font-semibold"
                    whileHover={{ scale: 1.1 }}
                  >
                    Featured
                  </motion.div>
                )}

                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <motion.h3
                  className="text-2xl font-bold mb-4 relative z-10 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.1 }}
                >
                  {project.title}
                </motion.h3>

                <p className="text-gray-300 mb-6 relative z-10 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                  {project.tech.map((tech) => (
                    <motion.span
                      key={tech}
                      className="px-3 py-1 bg-blue-500/20 rounded-full text-sm border border-blue-500/30"
                      whileHover={{ scale: 1.1, backgroundColor: 'rgba(59, 130, 246, 0.3)' }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>

                <div className="flex gap-4 relative z-10">
                  <motion.a
                    href={project.github}
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                    whileHover={{ scale: 1.1, x: 5 }}
                  >
                    <Github size={20} />
                    Code
                  </motion.a>
                  <motion.a
                    href={project.demo}
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                    whileHover={{ scale: 1.1, x: 5 }}
                  >
                    <ExternalLink size={20} />
                    Demo
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/20" />

        <motion.div
          className="max-w-7xl mx-auto relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h2
            className="text-5xl md:text-6xl font-bold text-center mb-20 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
            initial={{ y: 50 }}
            whileInView={{ y: 0 }}
          >
            About Me
          </motion.h2>

          <motion.div
            className="max-w-4xl mx-auto text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <p className="text-xl text-gray-200 leading-relaxed mb-6">
              I'm Advay Sharma, a passionate Full Stack Developer with expertise in creating
              immersive web experiences and robust backend systems. I love exploring the intersection
              of AI, modern web technologies, and creative design.
            </p>
            <p className="text-lg text-gray-300">
              When I'm not coding, you can find me gaming, exploring new technologies, or working on
              creative projects that push the boundaries of web development.
            </p>
          </motion.div>

          {/* Enhanced Timeline */}
          <div className="relative max-w-4xl mx-auto">
            <motion.div
              className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              transition={{ duration: 1 }}
            />

            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                className={`flex items-center mb-16 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <motion.div
                  className="w-5/12"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 hover:border-blue-500/50 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{item.icon}</span>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        {item.year}
                      </h3>
                    </div>
                    <h4 className="text-xl font-semibold mb-3 text-gray-200">{item.title}</h4>
                    <p className="text-gray-300 leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>

                <motion.div
                  className="w-2/12 flex justify-center"
                  whileHover={{ scale: 1.5 }}
                >
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full border-4 border-gray-900 shadow-lg shadow-blue-500/50" />
                </motion.div>

                <div className="w-5/12" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent" />

        <motion.div
          className="max-w-4xl mx-auto relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h2
            className="text-5xl md:text-6xl font-bold text-center mb-20 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
            initial={{ y: 50 }}
            whileInView={{ y: 0 }}
          >
            Get In Touch
          </motion.h2>

          <motion.div
            className="p-10 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 hover:border-blue-500/50 transition-all duration-300"
            whileHover={{
              boxShadow: '0 30px 60px rgba(59, 130, 246, 0.3)',
              y: -5
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
              >
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  required
                  className="w-full p-4 rounded-2xl bg-white/10 border border-white/20 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white placeholder-gray-400"
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
              >
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your Email"
                  required
                  className="w-full p-4 rounded-2xl bg-white/10 border border-white/20 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white placeholder-gray-400"
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
              >
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Your Message"
                  rows={5}
                  required
                  className="w-full p-4 rounded-2xl bg-white/10 border border-white/20 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white placeholder-gray-400 resize-none"
                />
              </motion.div>

              {/* Status Message */}
              {submitMessage && (
                <motion.div
                  className={`p-4 rounded-2xl text-center ${
                    submitStatus === 'success' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {submitMessage}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`w-full p-4 rounded-2xl font-semibold text-lg transition-all ${
                  isSubmitting
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-2xl hover:shadow-blue-500/50'
                }`}
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </motion.button>
            </form>

            <div className="flex justify-center gap-6 mt-10">
              {[
                { icon: Github, href: 'https://github.com/AdvaySharma248', label: 'GitHub' },
                { icon: Linkedin, href: 'https://www.linkedin.com/in/advay-sharma-6025ba314/', label: 'LinkedIn' },
                { icon: Mail, href: 'advaysharma2489@gmail.com', label: 'Email' },
                { icon: Download, href: '#', label: 'Resume' },
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="p-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  whileTap={{ scale: 0.9 }}
                  title={social.label}
                >
                  <social.icon size={24} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-gray-400 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent" />
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <p className="text-lg mb-2">
            © 2024 Advay Sharma. Built with passion and lots of ☕
          </p>
          <p className="text-sm text-gray-500">
            Powered by React, Three.js & Framer Motion
          </p>
        </motion.div>
      </footer>
    </div>
  );
}