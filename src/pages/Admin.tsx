import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  FileText, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  Edit2,
  Trash2,
  ArrowLeft,
  Save,
  Upload,
  GripVertical,
  Loader2
} from 'lucide-react';
import { useSite } from '../context/SiteContext';
import MediaDisplay from '../components/MediaDisplay';

import { auth, storage } from '../firebase';
import { signOut } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const hexToRgb = (hex: string) => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  return `${r}, ${g}, ${b}`;
};

const rgbToHex = (rgb: string) => {
  const rgbArray = rgb.match(/\d+/g);
  if (!rgbArray || rgbArray.length < 3) return '#000000';
  const hex = rgbArray.slice(0, 3).map(x => {
    const hexVal = parseInt(x).toString(16);
    return hexVal.length === 1 ? '0' + hexVal : hexVal;
  }).join('');
  return `#${hex}`;
};

const ColorInput = ({ label, cssVar, value, onChange }: { label: string, cssVar: string, value: string, onChange: (val: string) => void }) => {
  const [hex, setHex] = useState(value);
  const [rgb, setRgb] = useState(hexToRgb(value));
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setHex(value);
    setRgb(hexToRgb(value));
  }, [value]);

  const handleHexChange = (newHex: string) => {
    setHex(newHex);
    if (/^#[0-9A-F]{6}$/i.test(newHex) || /^#[0-9A-F]{3}$/i.test(newHex)) {
      setRgb(hexToRgb(newHex));
      onChange(newHex);
    }
  };

  const handleRgbChange = (newRgb: string) => {
    setRgb(newRgb);
    const rgbArray = newRgb.match(/\d+/g);
    if (rgbArray && rgbArray.length >= 3) {
      const newHex = rgbToHex(newRgb);
      if (/^#[0-9A-F]{6}$/i.test(newHex)) {
        setHex(newHex);
        onChange(newHex);
      }
    }
  };

  const safeHex = hex.length === 4 ? rgbToHex(hexToRgb(hex)) : (hex.length === 7 ? hex : '#000000');

  return (
    <div className="flex flex-col gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium text-sm text-gray-900">{label}</p>
          <p className="text-xs text-gray-500">{cssVar}</p>
        </div>
        <button 
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-8 h-8 rounded border border-gray-300 shadow-sm cursor-pointer transition-transform hover:scale-105"
          style={{ backgroundColor: safeHex }}
          aria-label="Toggle color inputs"
        />
      </div>
      {isOpen && (
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200 mt-1">
          <div>
            <label className="text-xs text-gray-500 mb-1 block font-medium">HEX</label>
            <div className="flex items-center gap-2">
              <input type="color" value={safeHex} onChange={(e) => handleHexChange(e.target.value)} className="w-6 h-6 p-0 border-0 rounded cursor-pointer shrink-0" />
              <input type="text" value={hex} onChange={(e) => handleHexChange(e.target.value)} className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-shadow" placeholder="#000000" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block font-medium">RGB</label>
            <input type="text" value={rgb} onChange={(e) => handleRgbChange(e.target.value)} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-shadow" placeholder="0, 0, 0" />
          </div>
        </div>
      )}
    </div>
  );
};

export default function Admin() {
  const { 
    logo, updateLogo, 
    projects, updateProjects, 
    home, updateHome,
    about, updateAbout, 
    contact, updateContact,
    theme, updateTheme
  } = useSite();

  const [activeTab, setActiveTab] = useState('projects');
  const [editingProject, setEditingProject] = useState<any>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedProjectIndex, setDraggedProjectIndex] = useState<number | null>(null);
  const [adminCategoryFilter, setAdminCategoryFilter] = useState('All');
  const [linkInputs, setLinkInputs] = useState<Record<number, string>>({});
  
  const [localProjects, setLocalProjects] = useState(projects);

  useEffect(() => {
    if (draggedProjectIndex === null) {
      setLocalProjects(projects);
    }
  }, [projects, draggedProjectIndex]);

  const adminCategories = ['All', ...Array.from(new Set(projects.map((p: any) => p.category).filter(Boolean)))];
  const filteredAdminProjects = adminCategoryFilter === 'All' ? localProjects : localProjects.filter((p: any) => p.category === adminCategoryFilter);
  
  // Pages Tab State
  const [activePageTab, setActivePageTab] = useState('home');
  const [homeForm, setHomeForm] = useState(home);
  const [aboutForm, setAboutForm] = useState(about);
  const [contactForm, setContactForm] = useState(contact);

  // Theme State
  const [themeForm, setThemeForm] = useState(theme);

  const handleThemeChange = (field: string, value: string) => {
    const newTheme = { ...themeForm, [field]: value };
    setThemeForm(newTheme);
    // Live preview
    const cssVar = `--${field.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    document.documentElement.style.setProperty(cssVar, value);
  };

  // --- Portfolio Handlers ---
  const handleEdit = (project: any) => {
    setEditingProject({ ...project });
    setLinkInputs({});
  };

  const handleAddProject = () => {
    setEditingProject({
      id: Date.now().toString(),
      title: '',
      category: '',
      client: '',
      role: '',
      year: new Date().getFullYear().toString(),
      description: '',
      image: '',
      contentImages: []
    });
    setLinkInputs({});
  };

  const handleSaveProject = () => {
    const exists = projects.find((p: any) => p.id === editingProject.id);
    if (exists) {
      updateProjects(projects.map((p: any) => p.id === editingProject.id ? editingProject : p));
    } else {
      updateProjects([editingProject, ...projects]);
    }
    alert('저장되었습니다.');
  };

  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('정말 삭제하시겠습니까?')) {
      updateProjects(projects.filter((p: any) => p.id !== id));
    }
  };

  const handleCancel = () => {
    setEditingProject(null);
    setLinkInputs({});
  };

  const handleAddDetailImage = () => {
    setEditingProject({
      ...editingProject,
      contentImages: [...(editingProject.contentImages || []), '']
    });
  };

  const handleRemoveDetailImage = (index: number) => {
    const newImages = editingProject.contentImages.filter((_: any, i: number) => i !== index);
    setEditingProject({ ...editingProject, contentImages: newImages });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newImages = [...editingProject.contentImages];
    const draggedImage = newImages[draggedIndex];
    
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);
    
    setDraggedIndex(index);
    setEditingProject({ ...editingProject, contentImages: newImages });
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // --- Project Reordering Handlers ---
  const handleProjectDragStart = (e: React.DragEvent, index: number) => {
    if (adminCategoryFilter !== 'All') {
      e.preventDefault();
      return;
    }
    setDraggedProjectIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleProjectDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (adminCategoryFilter !== 'All') return;
    if (draggedProjectIndex === null || draggedProjectIndex === index) return;
    
    const newProjects = [...localProjects];
    const draggedProject = newProjects[draggedProjectIndex];
    
    newProjects.splice(draggedProjectIndex, 1);
    newProjects.splice(index, 0, draggedProject);
    
    setDraggedProjectIndex(index);
    setLocalProjects(newProjects);
  };

  const handleProjectDragEnd = () => {
    if (draggedProjectIndex !== null) {
      updateProjects(localProjects);
    }
    setDraggedProjectIndex(null);
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleRegisterLink = (index: number) => {
    const url = linkInputs[index];
    if (url === undefined) return;

    if (url.trim() === '') {
      const newImages = [...(editingProject.contentImages || [])];
      newImages[index] = '';
      setEditingProject({...editingProject, contentImages: newImages});
      alert('링크가 삭제되었습니다.');
      return;
    }

    try {
      new URL(url);
      const newImages = [...(editingProject.contentImages || [])];
      newImages[index] = url;
      setEditingProject({...editingProject, contentImages: newImages});
      alert('등록되었습니다.');
    } catch (e) {
      alert('등록이 실패했습니다. 올바른 URL을 입력해주세요.');
    }
  };

  // Firebase Storage Image Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, index?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // 10MB 제한
    if (file.size > 10 * 1024 * 1024) {
      alert('10MB 이하의 파일만 업로드 가능합니다.');
      return;
    }
    
    setIsUploading(true);
    try {
      const fileRef = ref(storage, `projects/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      
      if (field === 'image') {
        setEditingProject({ ...editingProject, image: url });
      } else if (field === 'contentImages' && typeof index === 'number') {
        const newImages = [...(editingProject.contentImages || [])];
        newImages[index] = url;
        setEditingProject({ ...editingProject, contentImages: newImages });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("이미지 업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  // --- Logo Upload Handler ---
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'image/svg+xml') {
      alert('SVG 파일만 업로드 가능합니다.');
      return;
    }
    
    setIsUploading(true);
    try {
      const fileRef = ref(storage, `site/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      updateLogo(url);
    } catch (error) {
      console.error("Error uploading logo:", error);
      alert("로고 업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  // --- Pages Handlers ---
  const handleSaveHome = () => {
    updateHome(homeForm);
    alert('Home 페이지가 저장되었습니다.');
  };

  const handleSaveAbout = () => {
    updateAbout(aboutForm);
    alert('About 페이지가 저장되었습니다.');
  };

  const handleSaveContact = () => {
    updateContact(contactForm);
    alert('Contact 페이지가 저장되었습니다.');
  };

  const handleAddSocial = () => {
    const newSocial = { id: Date.now().toString(), platform: 'Instagram', url: '' };
    setContactForm({ ...contactForm, socials: [...(contactForm.socials || []), newSocial] });
  };

  const handleRemoveSocial = (index: number) => {
    const newSocials = [...(contactForm.socials || [])];
    newSocials.splice(index, 1);
    setContactForm({ ...contactForm, socials: newSocials });
  };

  const handleSocialChange = (index: number, field: string, value: string) => {
    const newSocials = [...(contactForm.socials || [])];
    newSocials[index] = { ...newSocials[index], [field]: value };
    setContactForm({ ...contactForm, socials: newSocials });
  };

  const handleSaveTheme = () => {
    updateTheme(themeForm);
    alert('테마 색상이 저장되었습니다.');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
        <Link to="/" className="p-6 border-b border-gray-200 flex items-center gap-2 hover:bg-gray-50 transition-colors">
          {logo ? <img src={logo} alt="Logo" className="h-6 w-auto object-contain brightness-0" /> : <span className="text-2xl font-bold tracking-tighter">drawee</span>}
          <span className="text-sm font-normal text-gray-500">Admin</span>
        </Link>
        
        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => {setActiveTab('dashboard'); setEditingProject(null);}}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <LayoutDashboard className="w-5 h-5" /> 대시보드
          </button>
          <button 
            onClick={() => {setActiveTab('projects'); setEditingProject(null);}}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'projects' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <ImageIcon className="w-5 h-5" /> 포트폴리오 관리
          </button>
          <button 
            onClick={() => {setActiveTab('pages'); setEditingProject(null);}}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'pages' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <FileText className="w-5 h-5" /> 페이지 관리
          </button>
          <button 
            onClick={() => {setActiveTab('settings'); setEditingProject(null);}}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Settings className="w-5 h-5" /> 설정 및 테마
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-2">
          <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5" /> 사이트로 돌아가기
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5" /> 로그아웃
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 relative">
        {isUploading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-black mb-4" />
            <p className="text-sm font-medium text-gray-900">이미지 업로드 중...</p>
          </div>
        )}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {activeTab === 'dashboard' && '대시보드'}
            {activeTab === 'projects' && (editingProject ? '포트폴리오 수정' : '포트폴리오 관리')}
            {activeTab === 'pages' && '페이지 관리 (Home / About / Contact)'}
            {activeTab === 'settings' && '설정 및 테마'}
          </h1>
        </header>

        {/* Projects Tab */}
        {activeTab === 'projects' && !editingProject && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold">모든 프로젝트</h2>
                <select 
                  value={adminCategoryFilter} 
                  onChange={(e) => setAdminCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
                >
                  {adminCategories.map(cat => (
                    <option key={cat as string} value={cat as string}>{cat}</option>
                  ))}
                </select>
              </div>
              <button onClick={handleAddProject} className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                <Plus className="w-4 h-4" /> 새 프로젝트
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
                    <th className="p-4 font-medium w-10"></th>
                    <th className="p-4 font-medium">썸네일</th>
                    <th className="p-4 font-medium">프로젝트명</th>
                    <th className="p-4 font-medium">카테고리</th>
                    <th className="p-4 font-medium text-right">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdminProjects.map((project: any, index: number) => (
                    <tr 
                      key={project.id} 
                      draggable={adminCategoryFilter === 'All'}
                      onDragStart={(e) => handleProjectDragStart(e, index)}
                      onDragEnter={(e) => handleProjectDragEnter(e, index)}
                      onDragEnd={handleProjectDragEnd}
                      onDragOver={(e) => e.preventDefault()}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${draggedProjectIndex === index ? 'opacity-50 bg-gray-100' : ''}`}
                    >
                      <td className="p-4 text-gray-400">
                        {adminCategoryFilter === 'All' && (
                          <div className="cursor-grab active:cursor-grabbing hover:text-black">
                            <GripVertical className="w-5 h-5" />
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        {project.image ? (
                          <MediaDisplay url={project.image} alt={project.title} className="w-16 h-10 object-cover rounded bg-gray-200 pointer-events-none" />
                        ) : (
                          <div className="w-16 h-10 rounded bg-gray-200"></div>
                        )}
                      </td>
                      <td className="p-4 font-medium text-gray-900">{project.title}</td>
                      <td className="p-4 text-sm text-gray-600">{project.category}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleEdit(project)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="수정"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={(e) => handleDeleteProject(project.id, e)} className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="삭제"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Edit Project Form */}
        {activeTab === 'projects' && editingProject && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
              <button onClick={handleCancel} className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors">
                <ArrowLeft className="w-4 h-4" /> 뒤로 가기
              </button>
              <div className="flex gap-3">
                <button onClick={handleCancel} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">취소</button>
                <button onClick={handleSaveProject} className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors">
                  <Save className="w-4 h-4" /> 저장하기
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">프로젝트명</label>
                  <input type="text" value={editingProject.title} onChange={(e) => setEditingProject({...editingProject, title: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                    <input type="text" value={editingProject.category} onChange={(e) => setEditingProject({...editingProject, category: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">연도</label>
                    <input type="text" value={editingProject.year} onChange={(e) => setEditingProject({...editingProject, year: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">클라이언트</label>
                    <input type="text" value={editingProject.client || ''} onChange={(e) => setEditingProject({...editingProject, client: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">역할 (Role)</label>
                    <input type="text" value={editingProject.role || ''} onChange={(e) => setEditingProject({...editingProject, role: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">프로젝트 설명</label>
                  <textarea rows={5} value={editingProject.description || ''} onChange={(e) => setEditingProject({...editingProject, description: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"></textarea>
                </div>
              </div>

              <div className="space-y-8">
                {/* Thumbnail Image Upload */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">메인 썸네일 이미지/동영상 (파일 첨부만 가능)</h3>
                  <div className="mb-3">
                    {editingProject.image ? (
                      <MediaDisplay url={editingProject.image} alt="Thumbnail preview" className="w-full aspect-video object-cover rounded-lg border border-gray-200 bg-white pointer-events-none" />
                    ) : (
                      <div className="w-full aspect-video bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 text-sm">이미지 없음</div>
                    )}
                  </div>
                  <label className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-50 transition-colors">
                    <Upload className="w-4 h-4" /> 내 컴퓨터에서 첨부
                    <input type="file" accept="image/*,video/mp4,video/quicktime,video/webm" className="hidden" onChange={(e) => handleImageUpload(e, 'image')} />
                  </label>
                </div>

                {/* Detail Images Upload */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-semibold text-gray-900">상세 본문 이미지/동영상</h3>
                    <button onClick={handleAddDetailImage} className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
                      <Plus className="w-3 h-3" /> 빈 슬롯 추가
                    </button>
                  </div>
                  <div className="space-y-4">
                    {editingProject.contentImages?.map((img: string, index: number) => (
                      <div 
                        key={index} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragEnter={(e) => handleDragEnter(e, index)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => e.preventDefault()}
                        className={`relative group bg-white p-2 rounded-lg border ${draggedIndex === index ? 'border-black opacity-50 shadow-lg scale-[1.02]' : 'border-gray-200'} transition-all`}
                      >
                        <div className="absolute top-4 left-4 z-10 p-1.5 bg-white/80 backdrop-blur-sm rounded shadow-sm cursor-grab active:cursor-grabbing text-gray-500 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity">
                          <GripVertical className="w-4 h-4" />
                        </div>
                        {img ? (
                          <MediaDisplay url={img} alt={`Detail ${index}`} className="w-full aspect-video object-cover rounded border border-gray-100 mb-2 pointer-events-none" />
                        ) : (
                          <div className="w-full aspect-video bg-gray-100 rounded border border-gray-200 mb-2 flex items-center justify-center text-gray-400 text-sm">이미지 없음</div>
                        )}
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <label className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs font-medium cursor-pointer hover:bg-gray-100 transition-colors">
                              <Upload className="w-3 h-3" /> 파일 첨부
                              <input type="file" accept="image/*,video/mp4,video/quicktime,video/webm" className="hidden" onChange={(e) => handleImageUpload(e, 'contentImages', index)} />
                            </label>
                            <button onClick={() => handleRemoveDetailImage(index)} className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded text-xs font-medium hover:bg-red-100 transition-colors">
                              삭제
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <input 
                              type="text" 
                              placeholder="또는 외부 링크 입력 (Vimeo 등)" 
                              value={linkInputs[index] !== undefined ? linkInputs[index] : (img || '')} 
                              onChange={(e) => setLinkInputs({...linkInputs, [index]: e.target.value})} 
                              className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-black"
                            />
                            <button 
                              onClick={() => handleRegisterLink(index)}
                              className="px-3 py-1.5 bg-black text-white rounded text-xs font-medium hover:bg-gray-800 transition-colors whitespace-nowrap"
                            >
                              등록
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Pages Tab */}
        {activeTab === 'pages' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="flex border-b border-gray-200">
              <button onClick={() => setActivePageTab('home')} className={`flex-1 py-4 text-sm font-medium transition-colors ${activePageTab === 'home' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-gray-700'}`}>
                Home 페이지
              </button>
              <button onClick={() => setActivePageTab('about')} className={`flex-1 py-4 text-sm font-medium transition-colors ${activePageTab === 'about' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-gray-700'}`}>
                About 페이지
              </button>
              <button onClick={() => setActivePageTab('contact')} className={`flex-1 py-4 text-sm font-medium transition-colors ${activePageTab === 'contact' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-gray-700'}`}>
                Contact 페이지
              </button>
            </div>

            <div className="p-6">
              {activePageTab === 'home' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">메인 헤드 텍스트 (줄바꿈은 엔터)</label>
                    <textarea rows={3} value={homeForm.title} onChange={(e) => setHomeForm({...homeForm, title: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">서브 텍스트 (Description)</label>
                    <textarea rows={4} value={homeForm.description} onChange={(e) => setHomeForm({...homeForm, description: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"></textarea>
                  </div>
                  <button onClick={handleSaveHome} className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">Home 내용 저장</button>
                </div>
              )}

              {activePageTab === 'about' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">메인 타이틀 (줄바꿈은 엔터)</label>
                    <textarea rows={3} value={aboutForm.title} onChange={(e) => setAboutForm({...aboutForm, title: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">소개글 (Description)</label>
                    <textarea rows={4} value={aboutForm.description} onChange={(e) => setAboutForm({...aboutForm, description: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">제공 서비스 (Services) - 쉼표(,)로 구분</label>
                    <input type="text" value={aboutForm.services} onChange={(e) => setAboutForm({...aboutForm, services: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">클라이언트 (Clients) - 쉼표(,)로 구분</label>
                    <input type="text" value={aboutForm.clients} onChange={(e) => setAboutForm({...aboutForm, clients: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                  </div>
                  <button onClick={handleSaveAbout} className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">About 내용 저장</button>
                </div>
              )}

              {activePageTab === 'contact' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">메인 타이틀</label>
                    <textarea rows={3} value={contactForm.title} onChange={(e) => setContactForm({...contactForm, title: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">이메일 주소</label>
                    <input type="email" value={contactForm.email} onChange={(e) => setContactForm({...contactForm, email: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">위치 (주소)</label>
                    <textarea rows={3} value={contactForm.location} onChange={(e) => setContactForm({...contactForm, location: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"></textarea>
                  </div>
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-gray-700">SNS 링크</label>
                      <button onClick={handleAddSocial} className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
                        <Plus className="w-3 h-3" /> SNS 추가
                      </button>
                    </div>
                    {contactForm.socials?.map((social: any, index: number) => (
                      <div key={social.id} className="flex gap-3 items-start">
                        <div className="w-1/3">
                          <select 
                            value={social.platform}
                            onChange={(e) => handleSocialChange(index, 'platform', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
                          >
                            <option value="Instagram">Instagram</option>
                            <option value="Twitter">Twitter</option>
                            <option value="Facebook">Facebook</option>
                            <option value="Linkedin">LinkedIn</option>
                            <option value="Youtube">YouTube</option>
                            <option value="Github">GitHub</option>
                            <option value="Dribbble">Dribbble</option>
                            <option value="Figma">Figma</option>
                            <option value="Mail">Mail</option>
                            <option value="Link">Link</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <input 
                            type="text" 
                            value={social.url}
                            onChange={(e) => handleSocialChange(index, 'url', e.target.value)}
                            placeholder="https://"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                        <button 
                          onClick={() => handleRemoveSocial(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button onClick={handleSaveContact} className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">Contact 내용 저장</button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Logo Settings */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-6">메인 로고 설정</h2>
              <div className="space-y-4">
                <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center min-h-[120px]">
                  {logo ? <img src={logo} alt="Current Logo" className="h-10 w-auto object-contain brightness-0" /> : <span className="text-4xl font-bold tracking-tighter">drawee</span>}
                </div>
                <label className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-50 transition-colors">
                  <Upload className="w-4 h-4" /> SVG 로고 업로드
                  <input type="file" accept=".svg" className="hidden" onChange={handleLogoUpload} />
                </label>
                <p className="text-xs text-gray-500 text-center">SVG 형식의 파일만 업로드 가능합니다.</p>
                {logo && (
                  <button onClick={() => updateLogo(null)} className="w-full py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    기본 텍스트 로고로 되돌리기
                  </button>
                )}
              </div>
            </div>

            {/* Theme Settings */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-6">테마 색상 설정</h2>
              <div className="space-y-4">
                <ColorInput label="기본 배경색" cssVar="--bg-color" value={themeForm.bgColor} onChange={(val) => handleThemeChange('bgColor', val)} />
                <ColorInput label="기본 텍스트 색상" cssVar="--text-color" value={themeForm.textColor} onChange={(val) => handleThemeChange('textColor', val)} />
                <ColorInput label="About 배경색" cssVar="--about-bg-color" value={themeForm.aboutBgColor} onChange={(val) => handleThemeChange('aboutBgColor', val)} />
                <ColorInput label="About 텍스트 색상" cssVar="--about-text-color" value={themeForm.aboutTextColor} onChange={(val) => handleThemeChange('aboutTextColor', val)} />
                <button onClick={handleSaveTheme} className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors mt-4">테마 색상 저장</button>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
