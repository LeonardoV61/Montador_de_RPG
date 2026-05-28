import { useState } from 'react';
import { useRef } from 'react';
import { useContext } from 'react';
import styles from './styles.Historico.module.css';
import { ContextoRegistros } from '../../../pages/Jogo/Jogo.jsx';
import HistoricoRegistro from '../HistoricoRegistro/HistoricoRegistro';
import Rolamento from '../Rolamento/Rolamento';
import Diario from '../Diario/Diario.jsx';

export default function Historico(props) {

   const { registros, setRegistros } = useContext(ContextoRegistros);

   const [msg, setMsg] = useState("");
   const divRegistros = useRef(null);

   function enviarMsg(msg) {
      msg.trim();
      if (!msg) return;
      let agora = new Date();
      setRegistros([...registros, {
         "id": registros.length+1,
         "aba": "Chat",
         "autor": "Você",
         "horario": agora.getHours()+':'+String(agora.getMinutes()).padStart(2,'0'),
         "texto": msg,
      }]);
      divRegistros.scrollTop = divRegistros.scrollHeight;
      setMsg("");
   }

   return (
      <>
      <div className={styles.historico}>
         <div className={styles.historicoRegistros} ref={divRegistros}>
            <div className={styles.historicoTitulo}>{props.titulo}</div>
            {registros.map((registro) => {
               if(registro.aba == "Chat" && props.aba == "Chat") {
                  return <HistoricoRegistro key={registro.id} autor={registro.autor} horario={registro.horario}>{registro.texto}</HistoricoRegistro>;
               }
               else if(registro.aba == "Roll" && props.aba != "Diario") {
                  return <Rolamento key={registro.id} registro={registro} />;
               }
               else if(registro.aba == "Diario" && props.aba == "Diario") {
                  return <Diario key={registro.id} titulo={registro.titulo} texto={registro.texto} etiqueta={registro.etiqueta} />;
               }
            })}
         </div>
         {(props.aba == "Chat") && <div className={styles.chatForm}>
            <textarea className={styles.chatTexto} onChange={(e) => setMsg(e.target.value)} placeholder="Escreva uma mensagem…" rows="1" value={msg}></textarea>
            <button className={styles.chatBotao} onClick={() => enviarMsg(msg)} >Enviar</button>
         </div>}
      </div>
      </>
   )
}