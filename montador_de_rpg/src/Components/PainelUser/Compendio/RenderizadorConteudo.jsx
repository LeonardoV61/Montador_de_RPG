import ReactMarkdown from 'react-markdown';
import styles from './styles.Compendio.module.css'; 

export default function RenderizadorConteudo({ blocos }) {
  if (!blocos) return null;

  return blocos.map((bloco, i) => {
    switch (bloco.tipo) {
      case 'texto':
        return (
          <div key={i} className={styles.blocoTexto}>
            <ReactMarkdown>{bloco.texto}</ReactMarkdown>
          </div>
        );

      case 'imagem':
        return (
          <div key={i} className={styles.blocoImagem}>
            <img src={bloco.src} alt={bloco.legenda || ''} />
            {bloco.legenda && <p className={styles.legenda}>{bloco.legenda}</p>}
          </div>
        );

      case 'tabela':
        return (
          <div key={i} className={styles.blocoTabela}>
            {bloco.titulo && <h3>{bloco.titulo}</h3>}
            <table>
              <thead>
                <tr>
                  {bloco.cabecalho.map((h, idx) => (
                    <th key={idx}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bloco.linhas.map((linha, j) => (
                  <tr key={j}>
                    {linha.map((cel, k) => (
                      <td key={k}>
                        <ReactMarkdown>{cel}</ReactMarkdown>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'colunas':
        return (
          <div key={i} className={styles.blocoColunas}>
            {bloco.colunas.map((col, j) => (
              <div key={j} className={styles.coluna}>
                <RenderizadorConteudo blocos={col} />
              </div>
            ))}
          </div>
        );

      case 'citacao':
        return (
          <blockquote key={i} className={styles.blocoCitacao}>
            <ReactMarkdown>{bloco.texto}</ReactMarkdown>
          </blockquote>
        );

      default:
        return null;
    }
  });
}