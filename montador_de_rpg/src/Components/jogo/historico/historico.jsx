import { useState } from 'react';
import { useRef } from 'react';
import { useContext } from 'react';
import styles from './styles.historico.module.css';
import contextoRegistros from '../jogo/jogo.jsx';
import historicoRegistro from '../historicoRegistro/historicoRegistro';
import rolamento from '../rolamento/rolamento';
import diario from '../diario/diario.jsx';

export default function historico(props) {

   const [registros, setRegistros] = useContext(contextoRegistros);

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
               if(registro.aba != "Diario" && props.aba != "Diario") {
                  <rolamento icone={registro.icone} autor={registro.autor} tipo={registro.tipo} valor={registro.valor} dado={registro.dado} valorAtributo={registro.valorAtributo} />
               }
               else if(registro.aba == "Chat" && props.aba == "Chat") {
                  <historicoRegistro autor={registro.autor} horario={registro.horario}>{registro.texto}</historicoRegistro>
               }
               else if(registro.aba == "Diario" && props.aba == "Diario") {
                  <diario titulo={registro.titulo} texto={registro.texto} etiqueta={registro.etiqueta} />
               }
            })}
         </div>
         {(props.aba == "Chat") && <div className={styles.chatForm}>
            <textarea className={styles.chatTexto} onChange={(e) => setMsg(e.target.value)} placeholder="Escreva uma ação ou mensagem…" rows="1" value={msg}></textarea>
            <button className={styles.chatBotao} onclick={() => enviarMsg(msg)} >Enviar</button>
         </div>}
      </div>
      </>
   )
}