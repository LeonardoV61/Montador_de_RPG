import { useState, useEffect } from 'react';
import { entidadeInstanciaService } from '../../../services/entidadeInstanciaService.js';
import styles from './styles.AbaPersonagem.module.css';

export default function AbaPersonagem({ instanciaId }) {
  const [dados, setDados] = useState(null);

  useEffect(() => {
    if (!instanciaId) return;
    entidadeInstanciaService.buscarPorId(instanciaId)
      .then(res => setDados(res?.data || res))
      .catch(console.error);
  }, [instanciaId]);

  if (!instanciaId) return (
    <div className={styles.personagemContainer}>
      <p style={{ padding: '1rem', opacity: 0.5 }}>Nenhum personagem ativo nesta sessão.</p>
    </div>
  );

  if (!dados) return (
    <div className={styles.personagemContainer}>
      <p style={{ padding: '1rem', opacity: 0.5 }}>Carregando...</p>
    </div>
  );

  const attrs      = dados.atributosAtuais || {};
  const gloria     = attrs.gloria ?? 0;
  const vigAtual   = attrs.VIG ?? 0;
  // Usa o VIG máximo registrado nas customizações, ou 18 como fallback razoável para o sistema
  const vigMax     = dados.customizacoes?.VIG_max ?? 18;
  const porcentagemVIG = Math.max(0, Math.min(100, (vigAtual / vigMax) * 100));

  const condicoes = ['fatigado', 'exausto', 'exposto', 'comprometido', 'machucado', 'mortalmente_machucado']
    .filter(c => !!attrs[c]);

  return (
    <div className={styles.personagemContainer}>
      <div className={styles.personagemHeader}>
        <div className={styles.nome}>{dados.nome}</div>
        <div className={styles.titulo}>{dados.tipo}</div>
      </div>

      <div className={styles.divisorEstilizado} />

      <div className={styles.corpoFicha}>
        {/* Virtudes */}
        <div className={styles.gradeAtributos}>
          {['VIG', 'CLA', 'SPI'].map(attr => (
            <div key={attr} className={styles.atributo}>
              <div className={styles.atributoNome}>{attr}</div>
              <div className={`${styles.atributoValor} ${(attrs[attr] ?? 0) < 8 ? styles.baixo : ''}`}>
                {attrs[attr] ?? '—'}
              </div>
            </div>
          ))}
        </div>

        {/* Barra de VIG */}
        <div className={styles.atributoHP}>
          <div className={styles.atributoHPCabecalho}>
            <span>VIGOR</span>
            <span>{vigAtual} / {vigMax}</span>
          </div>
          <div className={styles.atributoHPBarra}>
            <div className={styles.barraHPNivel} style={{ width: `${porcentagemVIG}%` }} />
          </div>
        </div>

        {/* Glória */}
        <div className={styles.atributoGloria}>
          <span className={styles.atributoGloriaTitulo}>GLÓRIA</span>
          <div className={styles.atributoGloriaSimbolos}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`${styles.atributoGloriaSimbolo} ${i < gloria ? styles.aceso : ''}`} />
            ))}
          </div>
        </div>

        {/* GD e Armadura */}
        <div className={styles.divisorEstilizado} />
        <div className={styles.linhasAtributo}>
          {[
            { label: 'Guarda (GD)', valor: attrs.GD },
            { label: 'Armadura',    valor: attrs.armadura },
          ].map(({ label, valor }) => (
            <div key={label} className={styles.linhaAtributo}>
              <span>{label}</span>
              <span>{valor ?? '—'}</span>
            </div>
          ))}
        </div>

        {/* Condições ativas */}
        {condicoes.length > 0 && (
          <>
            <div className={styles.divisorEstilizado} />
            <div className={styles.secaoEfeitos}>
              <span className={styles.subtituloSecao}>CONDIÇÕES ATIVAS</span>
              <div className={styles.efeitos}>
                {condicoes.map(c => (
                  <span key={c} className={`${styles.efeito} ${styles.ferido}`}>
                    {c.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}