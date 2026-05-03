import styles from '../Css/styles.formL.module.css'
import eye from '../../assets/eye-fill.svg'
import closedEye from '../../assets/eye-slash-fill.svg'
import { useRef } from 'react'

export default function Form( props ){
    const inputPass = useRef(null)
    const bi = useRef(null)

    function mostrarSenha() {
        if(inputPass.current.type === 'password') {

          inputPass.current.setAttribute('type', 'text')
          bi.current.setAttribute('src', closedEye)

        } else {

          inputPass.current.setAttribute('type', 'password')
          bi.current.setAttribute('src', eye)
        }
    }


    return <>
            <form className={styles.formCont} action={ props.action } onSubmit={e => e.preventDefault()}>
                
                <h1 className={styles.formTitle}>{ props.title }</h1>
                
                <input onChange={props.onInputChange} 
                        className={styles.inputs} 
                        placeholder='Nome' 
                        name='nome' 
                        type="text"/>

                <div className={styles.passwordCont} >
                    <input onChange={props.onInputChange} 
                            className={styles.inputs} 
                            placeholder="Senha" 
                            name='senha' 
                            type="password" 
                            ref={inputPass}/>

                    <img className={styles.bi} 
                         src={eye} 
                         ref={bi} 
                         onClick={mostrarSenha}
                          alt="ver senha" />
                </div>

                <button className={styles.formBtn} 
                        type="button"
                        onClick={ props.click }>
                        { props.btn }
                </button>

                <h5 className={styles.error}>{props.aContent}</h5>
            </form>

    </>
}