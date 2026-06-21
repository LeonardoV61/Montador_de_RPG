import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usuarioService } from '../../services/usuarioService.js';
import SelecaoSistema from '../../Components/CriacaoPersonagem/SelecaoSistema.jsx';
import ExecucaoProcedimento from '../../Components/CriacaoPersonagem/ExecucaoProcedimento.jsx';
import styles from './CriacaoPersonagem.module.css';

export default function CriacaoPersonagem() {
  const navigate = useNavigate();

  const [usuarioId, setUsuarioId] = useState(null);
  const [campanhaAtivaId, setCampanhaAtivaId] = useState(null);
  const [carregandoUsuario, setCarregandoUsuario] = useState(true);
  const [fase, setFase] = useState('selecao');
  const [selecao, setSelecao] = useState(null);
  const [personagemFinal, setPersonagemFinal] = useState(null);
  const [erroGlobal, setErroGlobal] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await usuarioService.perfil();
        // A resposta pode variar: res.data direto ou res.data.data
        const perfil = res.data?.data || res.data;
        setUsuarioId(perfil?.id ?? null);
        // Futuramente: buscar campanha ativa, ex:
        // const campAtiva = await campanhaService.buscarAtiva(perfil.id);
        // setCampanhaAtivaId(campAtiva?.id ?? null);
      } catch {
        setErroGlobal('Sessão inválida. Faça login novamente.');
      } finally {
        setCarregandoUsuario(false);
      }
    })();
  }, []);

  function handleSelecaoConfirmada(dados) {
    setSelecao(dados);
    setFase('procedimento');
    setErroGlobal(null);
  }

  function handleConcluido(personagem) {
    setPersonagemFinal(personagem);
    setFase('concluido');
  }

  function handleErro(msg) {
    setErroGlobal(msg);
    setFase('selecao');
  }

  function voltarParaSelecao() {
    setFase('selecao');
    setErroGlobal(null);
  }

  if (carregandoUsuario) {
    return (
      <div className={styles.centradoFull}>
        <div className={styles.spinner} />
      </div>
    );
  }

  return (
    <div className={styles.pagina}>
      {fase === 'procedimento' && (
        <button className={styles.botaoVoltar} onClick={voltarParaSelecao}>
          ← Voltar
        </button>
      )}

      {erroGlobal && (
        <div className={styles.erroGlobal}>
          <span>{erroGlobal}</span>
          <button onClick={() => setErroGlobal(null)}>✕</button>
        </div>
      )}

      {fase === 'selecao' && (
        <SelecaoSistema onConfirmar={handleSelecaoConfirmada} />
      )}

      {fase === 'procedimento' && selecao && usuarioId && (
        <ExecucaoProcedimento
          sistema={selecao.sistema}
          entidade={selecao.entidade}
          nomePersonagem={selecao.nomePersonagem}
          usuarioId={usuarioId}
          campanhaAtivaId={campanhaAtivaId}  // ← adicionado (por enquanto null)
          onConcluido={handleConcluido}
          onErro={handleErro}
        />
      )}

      {fase === 'concluido' && personagemFinal && (
        <div className={styles.concluidoPagina}>
          <span className={styles.icone}>✦</span>
          <h1 className={styles.tituloConcluido}>
            {personagemFinal.instanciaNome || selecao?.nomePersonagem}
          </h1>
          <p className={styles.subtitulo}>O cavaleiro está forjado</p>
          <div className={styles.acoes}>
            <button className={styles.botaoPrimario} onClick={() => navigate('/menu')}>
              Ir para o Menu
            </button>
            <button className={styles.botaoSecundario} onClick={voltarParaSelecao}>
              Criar outro
            </button>
          </div>
        </div>
      )}
    </div>
  );
}