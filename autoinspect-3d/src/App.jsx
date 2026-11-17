import { Suspense, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls, Html } from '@react-three/drei'
import {
  Activity, ArrowDownToLine, CarFront, Check, ChevronDown, CircleHelp,
  ClipboardList, Clock3, FileText, Gauge, History, Layers3, Plus,
  RotateCcw, Search, Settings2, ShieldCheck, Sparkles, Wrench, X
} from 'lucide-react'

const PARTS = [
  { id: 'hood', name: 'Capô', group: 'Dianteira', position: [1.18, 1.02, 0], size: [1.12, .25, 1.28], color: '#dce4ef' },
  { id: 'front_bumper', name: 'Para-choque dianteiro', group: 'Dianteira', position: [2.03, .64, 0], size: [.28, .34, 1.38], color: '#cbd5e1' },
  { id: 'front_left_fender', name: 'Paralama dianteiro esquerdo', group: 'Lateral esquerda', position: [1.2, .78, .7], size: [.82, .28, .12], color: '#dce4ef' },
  { id: 'front_right_fender', name: 'Paralama dianteiro direito', group: 'Lateral direita', position: [1.2, .78, -.7], size: [.82, .28, .12], color: '#dce4ef' },
  { id: 'door_front_left', name: 'Porta dianteira esquerda', group: 'Lateral esquerda', position: [.15, .91, .72], size: [1.08, .56, .1], color: '#e8eef6' },
  { id: 'door_front_right', name: 'Porta dianteira direita', group: 'Lateral direita', position: [.15, .91, -.72], size: [1.08, .56, .1], color: '#e8eef6' },
  { id: 'door_rear_left', name: 'Porta traseira esquerda', group: 'Lateral esquerda', position: [-.94, .91, .72], size: [.88, .56, .1], color: '#e8eef6' },
  { id: 'door_rear_right', name: 'Porta traseira direita', group: 'Lateral direita', position: [-.94, .91, -.72], size: [.88, .56, .1], color: '#e8eef6' },
  { id: 'roof', name: 'Teto', group: 'Superior', position: [-.25, 1.7, 0], size: [1.65, .16, 1.16], color: '#dce4ef' },
  { id: 'trunk', name: 'Tampa do porta-malas', group: 'Traseira', position: [-1.65, 1.02, 0], size: [.68, .23, 1.28], color: '#dce4ef' },
  { id: 'rear_bumper', name: 'Para-choque traseiro', group: 'Traseira', position: [-2.02, .64, 0], size: [.28, .34, 1.38], color: '#cbd5e1' },
  { id: 'windshield', name: 'Para-brisa', group: 'Vidros', position: [.66, 1.43, 0], size: [.72, .08, 1.13], color: '#263b55' },
  { id: 'rear_glass', name: 'Vidro traseiro', group: 'Vidros', position: [-1.15, 1.43, 0], size: [.62, .08, 1.08], color: '#263b55' },
  { id: 'wheel_front_left', name: 'Roda dianteira esquerda', group: 'Rodas', position: [1.22, .47, .78], color: '#202a38' },
  { id: 'wheel_front_right', name: 'Roda dianteira direita', group: 'Rodas', position: [1.22, .47, -.78], color: '#202a38' },
  { id: 'wheel_rear_left', name: 'Roda traseira esquerda', group: 'Rodas', position: [-1.28, .47, .78], color: '#202a38' },
  { id: 'wheel_rear_right', name: 'Roda traseira direita', group: 'Rodas', position: [-1.28, .47, -.78], color: '#202a38' },
]

const SERVICES = [
  { name: 'Funilaria', price: 350 },
  { name: 'Pintura', price: 420 },
  { name: 'Martelinho de ouro', price: 280 },
  { name: 'Substituição da peça', price: 650 },
  { name: 'Polimento', price: 150 },
  { name: 'Reparo de vidro', price: 220 },
]

function Part({ part, selected, damaged, onSelect }) {
  const common = {
    onClick: (event) => { event.stopPropagation(); onSelect(part) },
    onPointerOver: (event) => { event.stopPropagation(); document.body.style.cursor = 'pointer' },
    onPointerOut: () => { document.body.style.cursor = 'auto' },
    castShadow: true,
    receiveShadow: true,
  }
  const materialColor = selected ? '#2f8cff' : damaged ? '#e5a43b' : part.color
  if (part.id.startsWith('wheel')) {
    return (
      <group position={part.position} rotation={[Math.PI / 2, 0, 0]} {...common}>
        <mesh>
          <cylinderGeometry args={[.39, .39, .2, 32]} />
          <meshStandardMaterial color={selected ? '#2f8cff' : '#171e2b'} metalness={.72} roughness={.36} />
        </mesh>
        <mesh position={[0, 0, .11]}>
          <cylinderGeometry args={[.2, .2, .025, 24]} />
          <meshStandardMaterial color={selected ? '#8bc2ff' : '#9aa8bb'} metalness={.9} roughness={.24} />
        </mesh>
      </group>
    )
  }
  return (
    <mesh position={part.position} {...common}>
      <boxGeometry args={part.size} />
      <meshStandardMaterial color={materialColor} metalness={.48} roughness={.32} emissive={selected ? '#1459a8' : damaged ? '#7c4b0c' : '#000000'} emissiveIntensity={selected ? .45 : damaged ? .28 : 0} />
    </mesh>
  )
}

function CarPrototype({ selectedPart, damages, onSelect }) {
  const damagedIds = useMemo(() => new Set(damages.map((damage) => damage.partId)), [damages])
  return (
    <group position={[0, 0, 0]}>
      {/* Silhueta demonstrativa: carroceria simplificada, não é um escaneamento OEM do Gol. */}
      <mesh position={[0, .76, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.72, .58, 1.34]} />
        <meshStandardMaterial color="#dce4ef" metalness={.42} roughness={.34} />
      </mesh>
      <mesh position={[-.23, 1.28, 0]} castShadow>
        <boxGeometry args={[1.82, .82, 1.2]} />
        <meshStandardMaterial color="#dce4ef" metalness={.38} roughness={.34} />
      </mesh>
      {PARTS.map((part) => (
        <Part key={part.id} part={part} selected={selectedPart?.id === part.id} damaged={damagedIds.has(part.id)} onSelect={onSelect} />
      ))}
      <mesh position={[.72, 1.43, .01]} rotation={[0, 0, -.34]}>
        <boxGeometry args={[.73, .06, 1.1]} />
        <meshStandardMaterial color="#233c57" metalness={.25} roughness={.16} transparent opacity={.9} />
      </mesh>
      <mesh position={[-1.13, 1.43, .01]} rotation={[0, 0, .34]}>
        <boxGeometry args={[.62, .06, 1.08]} />
        <meshStandardMaterial color="#233c57" metalness={.25} roughness={.16} transparent opacity={.9} />
      </mesh>
      <mesh position={[2.18, .83, 0]}>
        <boxGeometry args={[.035, .1, .48]} />
        <meshStandardMaterial color="#182333" />
      </mesh>
    </group>
  )
}

function Scene({ selectedPart, damages, onSelect }) {
  return (
    <Canvas shadows camera={{ position: [5.8, 3.5, 6.2], fov: 38 }} dpr={[1, 1.7]}>
      <color attach="background" args={['#0b1220']} />
      <ambientLight intensity={1.15} />
      <directionalLight position={[5, 8, 5]} intensity={2.1} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-5, 3, -4]} intensity={.8} color="#4c8fd8" />
      <Suspense fallback={null}>
        <Environment preset="city" />
        <CarPrototype selectedPart={selectedPart} damages={damages} onSelect={onSelect} />
        <ContactShadows position={[0, .03, 0]} opacity={.42} scale={8} blur={2.8} far={3} />
      </Suspense>
      <OrbitControls makeDefault target={[0, .95, 0]} minDistance={4} maxDistance={11} maxPolarAngle={Math.PI / 2.02} />
    </Canvas>
  )
}

export default function App() {
  const [selectedPart, setSelectedPart] = useState(PARTS[4])
  const [damageType, setDamageType] = useState('Amassado')
  const [severity, setSeverity] = useState('Média')
  const [service, setService] = useState('Funilaria')
  const [notes, setNotes] = useState('')
  const [damages, setDamages] = useState([])
  const [activeTab, setActiveTab] = useState('inspection')
  const [search, setSearch] = useState('')
  const [showAllParts, setShowAllParts] = useState(false)

  const servicePrice = SERVICES.find((item) => item.name === service)?.price ?? 0
  const total = damages.reduce((sum, item) => sum + item.price, 0)
  const filteredParts = PARTS.filter((part) => part.name.toLowerCase().includes(search.toLowerCase()))
  const visibleParts = showAllParts ? filteredParts : filteredParts.slice(0, 7)

  function addDamage() {
    if (!selectedPart) return
    const severityFactor = severity === 'Leve' ? .65 : severity === 'Grave' ? 1.55 : 1
    const newDamage = {
      id: crypto.randomUUID(),
      partId: selectedPart.id,
      partName: selectedPart.name,
      type: damageType,
      severity,
      service,
      price: Math.round(servicePrice * severityFactor),
      notes,
    }
    setDamages((current) => [...current, newDamage])
    setNotes('')
  }

  function removeDamage(id) {
    setDamages((current) => current.filter((item) => item.id !== id))
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand"><div className="brand-mark"><CarFront size={21} /></div><div><strong>AutoInspect <span>3D</span></strong><small>PLATAFORMA DE INSPEÇÃO VEICULAR</small></div></div>
        <div className="topbar-center"><span className="status-dot" /> Protótipo em desenvolvimento <span className="divider-dot">/</span> Oficina Demo</div>
        <div className="topbar-actions"><button className="icon-button" title="Ajuda"><CircleHelp size={18} /></button><button className="avatar">OF</button></div>
      </header>

      <main className="workspace">
        <aside className="sidebar">
          <div className="side-label">MENU PRINCIPAL</div>
          <button className="side-link"><Gauge size={17}/> Visão geral</button>
          <button className="side-link active"><Activity size={17}/> Inspeção 3D</button>
          <button className="side-link"><CarFront size={17}/> Veículos</button>
          <button className="side-link"><ClipboardList size={17}/> Orçamentos</button>
          <button className="side-link"><History size={17}/> Histórico</button>
          <div className="side-spacer" />
          <div className="side-label">SISTEMA</div>
          <button className="side-link"><Settings2 size={17}/> Configurações</button>
          <div className="sidebar-footer"><ShieldCheck size={16}/><span>Ambiente de demonstração<br/><b>Dados locais · sem persistência</b></span></div>
        </aside>

        <section className="main-content">
          <div className="page-heading">
            <div><div className="eyebrow">INSPEÇÃO / NOVA VISTORIA</div><h1>Inspeção do veículo</h1><p>Selecione uma peça no modelo 3D para registrar uma avaria.</p></div>
            <div className="heading-actions"><button className="button secondary" onClick={() => { setDamages([]); setSelectedPart(PARTS[4]) }}><RotateCcw size={15}/> Reiniciar</button><button className="button primary" onClick={() => window.print()}><FileText size={15}/> Exportar resumo</button></div>
          </div>

          <div className="vehicle-strip">
            <div className="vehicle-icon"><CarFront size={23}/></div>
            <div className="vehicle-info"><strong>Volkswagen Gol</strong><span>2022 · Hatch · Protótipo de inspeção</span></div>
            <div className="vehicle-meta"><span>PLACA</span><b>ABC-1D23</b></div>
            <div className="vehicle-meta"><span>ORDEM DE SERVIÇO</span><b>OS-2026-0001</b></div>
            <div className="vehicle-state"><span className="status-dot"/> Em inspeção</div>
          </div>

          <div className="content-grid">
            <section className="viewer-card">
              <div className="card-heading"><div><strong>Visualização 3D</strong><span>Arraste para girar · Scroll para aproximar</span></div><div className="view-tools"><span className="live-pill"><i/> 3D ATIVO</span><button className="icon-button" title="Rotação livre"><RotateCcw size={16}/></button></div></div>
              <div className="viewer-stage"><Scene selectedPart={selectedPart} damages={damages} onSelect={setSelectedPart}/><div className="viewer-watermark">AUTOINSPECT <b>3D</b></div><div className="viewer-hint"><span className="hint-dot"/> Clique diretamente em uma peça do veículo</div></div>
              <div className="viewer-legend"><span><i className="legend-selected"/> Peça selecionada</span><span><i className="legend-damaged"/> Peça com avaria</span><span><i className="legend-normal"/> Sem registro</span></div>
              <div className="selected-part"><div className="selected-part-icon"><Layers3 size={18}/></div><div><small>PEÇA SELECIONADA</small><strong>{selectedPart?.name ?? 'Nenhuma peça selecionada'}</strong></div><span className="selected-group">{selectedPart?.group}</span></div>
            </section>

            <aside className="inspection-panel">
              <div className="panel-tabs"><button className={activeTab === 'inspection' ? 'tab active' : 'tab'} onClick={() => setActiveTab('inspection')}>Registrar avaria</button><button className={activeTab === 'list' ? 'tab active' : 'tab'} onClick={() => setActiveTab('list')}>Avarias <span>{damages.length}</span></button></div>
              {activeTab === 'inspection' ? (
                <div className="panel-body">
                  <div className="section-title"><span>01</span><div><strong>Identificação da peça</strong><small>Peça selecionada no modelo 3D</small></div></div>
                  <div className="selected-field"><Layers3 size={16}/><strong>{selectedPart?.name}</strong><Check size={16}/></div>
                  <div className="section-title"><span>02</span><div><strong>Detalhes da avaria</strong><small>Descreva o problema identificado</small></div></div>
                  <label className="field-label">Tipo de avaria</label>
                  <select value={damageType} onChange={(event) => setDamageType(event.target.value)}><option>Amassado</option><option>Risco</option><option>Trinca</option><option>Quebrado</option><option>Desalinhado</option><option>Falta de peça</option></select>
                  <label className="field-label">Nível de gravidade</label>
                  <div className="severity-options">{['Leve', 'Média', 'Grave'].map((item) => <button key={item} className={severity === item ? 'severity active ' + item.toLowerCase() : 'severity'} onClick={() => setSeverity(item)}>{item}</button>)}</div>
                  <label className="field-label">Serviço recomendado</label>
                  <select value={service} onChange={(event) => setService(event.target.value)}>{SERVICES.map((item) => <option key={item.name}>{item.name}</option>)}</select>
                  <label className="field-label">Observações</label>
                  <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Ex.: amassado próximo à maçaneta..." rows={2}/>
                  <div className="price-preview"><div><small>VALOR ESTIMADO DO SERVIÇO</small><strong>R$ {Math.round(servicePrice * (severity === 'Leve' ? .65 : severity === 'Grave' ? 1.55 : 1)).toLocaleString('pt-BR')}</strong></div><span>Valor demonstrativo</span></div>
                  <button className="button primary add-button" onClick={addDamage}><Plus size={17}/> Adicionar avaria</button>
                </div>
              ) : (
                <div className="panel-body damage-list">
                  <div className="list-summary"><strong>{damages.length} registro(s)</strong><span>Itens desta inspeção</span></div>
                  {damages.length === 0 ? <div className="empty-state"><ClipboardList size={28}/><strong>Nenhuma avaria registrada</strong><span>Selecione uma peça e adicione o primeiro registro.</span></div> : damages.map((item) => <div className="damage-item" key={item.id}><div className="damage-item-top"><strong>{item.partName}</strong><button className="remove-button" onClick={() => removeDamage(item.id)}><X size={15}/></button></div><span>{item.type} · {item.severity} · {item.service}</span><b>R$ {item.price.toLocaleString('pt-BR')}</b>{item.notes && <small>{item.notes}</small>}</div>)}
                </div>
              )}
              <div className="panel-total"><div><span>TOTAL DO ORÇAMENTO</span><small>{damages.length} serviço(s) registrado(s)</small></div><strong>R$ {total.toLocaleString('pt-BR')}</strong></div>
            </aside>
          </div>

          <section className="parts-card">
            <div className="parts-header"><div><strong>Peças do veículo</strong><span>Selecione também pela lista</span></div><div className="parts-search"><Search size={15}/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar peça..."/></div></div>
            <div className="parts-list">{visibleParts.map((part) => { const isDamaged = damages.some((item) => item.partId === part.id); return <button key={part.id} onClick={() => {setSelectedPart(part);setActiveTab('inspection')}} className={selectedPart?.id === part.id ? 'part-chip selected' : 'part-chip'}><span className={isDamaged ? 'part-indicator damaged' : 'part-indicator'}/>{part.name}{isDamaged && <b>!</b>}</button> })}</div>
            {filteredParts.length > 7 && <button className="show-more" onClick={() => setShowAllParts(!showAllParts)}>{showAllParts ? 'Mostrar menos' : 'Ver todas as peças'} <ChevronDown size={14}/></button>}
          </section>
          <footer className="page-footer"><span>AutoInspect 3D · Protótipo funcional</span><span>Modelo geométrico demonstrativo · Não utilizar como laudo técnico</span></footer>
        </section>
      </main>
    </div>
  )
}
