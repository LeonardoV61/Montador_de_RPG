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
      if (!text) return;
      let agora = new Date();
      setRegistros(...registros, {
         "aba": "Chat",
         "autor": "Você",
         "horario": agora.getHours()+':'+String(agora.getMinutes()).padStart(2,'0'),
         "texto": msg,
      });
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
                  <HistoricoRegistro autor={registro.autor} horario={registro.horario}>{registro.texto}</HistoricoRegistro>
               }
               else if(registro.aba != "Diario" && props.aba != "Diario") {
                  <Rolamento icone={registro.icone} autor={registro.autor} tipo={registro.tipo} valor={registro.valor} dado={registro.dado} valorAtributo={registro.valorAtributo} />
               }
               else if(registro.aba == "Diario" && props.aba == "Diario") {
                  <Diario titulo={registro.titulo} texto={registro.texto} etiqueta={registro.etiqueta} />
               }
            })}
         </div>
         {(props.aba == "Chat") && <div className={styles.chatForm}>
            <textarea className={styles.chatTexto} onChange={(e) => setMsg(e.target.value)} placeholder="Escreva uma ação ou mensagem…" rows="1" value={msg}></textarea>
            <button className={styles.chatBotao} onClick={() => enviarMsg(msg)} >Enviar</button>
         </div>}
      </div>
      </>
   )
}