// Components/Jogo/InterpretadorEtapa/InterpretadorEtapa.jsx
import FormularioInput from '../CriacaoPersonagem/FormularioInput';
import SelecaoAlvoMapa from './SelecaoAlvoMapa';
import RolagemDados from './RolagemDados';
import styles from './InterpretadorEtapa.module.css';

export default function InterpretadorEtapa({ etapa, onResponder, carregando }) {
  const tipo = etapa?.tipoEtapa || etapa?.tipo_input;

  switch (tipo) {
    case 'SOLICITAR_INPUT':
      return <FormularioInput etapa={etapa} onResponder={onResponder} carregando={carregando} />;
    
    case 'SOLICITAR_ROLAGEM':
      return (
        <div className={styles.container}>
          <p>{etapa.parametrosEtapa?.campoPedido || 'Role os dados'}</p>
          <RolagemDados config={etapa.parametrosEtapa?.rolagem} onConfirmar={onResponder} />
        </div>
      );
    
    case 'DEFINIR_ALVO':
      return <SelecaoAlvoMapa etapa={etapa} onResponder={onResponder} carregando={carregando} />;
    
    default:
      return <div>Tipo de etapa não suportado: {tipo}</div>;
  }
}