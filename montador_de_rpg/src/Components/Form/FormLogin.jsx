import styles from './styles.forms.module.css';
import eye from '../../assets/eye-fill.svg';
import closedEye from '../../assets/eye-slash-fill.svg';
import { useRef } from 'react';

export default function Form({ children, ...props }){
        const inputPass = useRef(null);
        const bi = useRef(null);

        function mostrarSenha() {
                if(inputPass.current.type === 'password') {
                        inputPass.current.setAttribute('type', 'text');
                        bi.current.setAttribute('src', closedEye);
                } else {
                        inputPass.current.setAttribute('type', 'password');
                        bi.current.setAttribute('src', eye);
                }
        }

        function handleEnter(e, tipo) {
                if (e.key === 'Enter') {
                        if(tipo == "email") {
                                inputPass.current.focus();
                        }
                        else if(tipo == "senha") {
                                props.click();
                        }
                }
        }

        return <>
                <form className={styles.formCont} onSubmit={e => e.preventDefault()}>
                        
                        <h1 className={styles.formTitle}>{ props.title }</h1>
                        
                        <input onChange={props.onInputChange}
                                onKeyDown={(e) => handleEnter(e, "email")}
                                className={styles.inputs} 
                                placeholder='Email' 
                                name='email'
                                type="email" />

                        <div className={styles.passwordCont} >
                        <input onChange={props.onInputChange}
                                onKeyDown={(e) => handleEnter(e, "senha")}
                                className={styles.inputs} 
                                placeholder="Senha" 
                                name='senha' 
                                type="password" 
                                ref={inputPass}/>

                        <img className={styles.bi} 
                                src={eye} 
                                ref={bi} 
                                onClick={() => mostrarSenha()}
                                alt="ver senha" />
                        </div>

                        <button className={styles.formBtn} 
                                onKeyDown={(e) => handleEnter(e, "btn")}
                                type="button"
                                onClick={ props.click }>
                                { props.btn }
                        </button>

                        <h5 className={styles.error}>{props.aContent}</h5>

                        {children}
                </form>
        </>
}