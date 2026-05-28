import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import styles from '../../Css/styles.CriaT.module.css'

export default function CriaCateg() {
    const [categoriasPrincipais, setCategoriasPrincipais] = useState([])
    const [file, setFile] = useState(null)
    const [ehSubcategoria, setEhSubcategoria] = useState(false)
    const [categoriaPai, setCategoriaPai] = useState("")
    const [fechar, setFechar] = useState(false)
    const [criando, setCriando] = useState(false)


    
    useEffect(() => {
        fetch('https://back-end-barbalao.onrender.com/api/categoria/principais/')
            .then(res => res.json())
            .then(data => {
                setCategoriasPrincipais(data)
            })
            .catch(err => {
                console.error('Erro ao carregar categorias:', err)
            })
    }, [])

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
    }

    const handleSub = (e) => {
        e.preventDefault()

        if (criando) return

        setCriando(true)

        const formData = new FormData(e.target)
        const data = Object.fromEntries(formData.entries())

        if (ehSubcategoria && !categoriaPai) {
            alert("Para criar uma subcategoria, selecione uma categoria pai")
            return
        }
        
        console.log("Dados do form:", data)

        if (file) {
            const leitor = new FileReader()

            leitor.onload = (ev) => {
                
                data.imagem = ev.target.result

                const payload = {
                    nome: data.nome,
                    imagem: data.imagem,
                    usuario: localStorage.getItem('id_user'),
                    sub: ehSubcategoria && categoriaPai ? parseInt(categoriaPai) : null
                }

                console.log("Payload enviado:", payload)

                fetch('https://back-end-barbalao.onrender.com/api/categoria/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify(payload)
                })
                    .then((res) =>{
                        if (!res.ok) {
                            console.log("Status da resposta:", res.status)
                            if (!res.ok) {
                                return res.json().then((err) => {
                                    console.error("Erro detalhado:", err)
                                    throw new Error(err.message || 'Falha ao criar categoria')
                                })
                            }
                            return res.json()
                        }
                    })
                    .then((json) => {
                        alert(`Categoria criada com sucesso!`)
                        e.target.reset()
                        setFile(null)
                        setEhSubcategoria(false)
                        setCategoriaPai("")
                        location.reload()
                    })
                    .catch((err) => {
                        alert(`Erro: ${err.message}`)
                        setFile(null)
                        setEhSubcategoria(false)
                        setCategoriaPai("")
                        location.reload()
                        return;
                    })
            }
            
            leitor.readAsDataURL(file)
        } else {
            alert("Selecione uma imagem")
        }
    }

    if(fechar) {
        return null
    }

    return(
        <>
            <div className={styles.background}>
                <div className={styles.formContainer}>
                    <button className={styles.backButton}
                        onClick={() => setFechar(true)}
                    >+</button>
                    <h1>{ehSubcategoria? "SUBCATEGORIA": "CATEGORIA"}</h1>
                    <form className={styles.form} onSubmit={handleSub}>
                        
                        <label className={styles.label} htmlFor="nome">Nome:</label>
                        <input 
                            className={styles.input}
                            type="text" 
                            name="nome" 
                            id="nome" 
                            required 
                        />

                        <label className={styles.label} htmlFor="imagem">Imagem:</label>
                        <input 
                            className={styles.inputFile}
                            type="file" 
                            name="imagem" 
                            id="imagem" 
                            accept="image/*" 
                            onChange={handleFileChange}
                            required
                        />

                        <div className={styles.checkboxContainer}>
                            <label className={`${styles.checkboxLabel} ${(categoriasPrincipais.length <= 0)? styles.disabled: null}`} htmlFor="checkbox">
                                <input 
                                    type="checkbox" 
                                    checked={ehSubcategoria}
                                    name="checkbox"
                                    onChange={(e) => setEhSubcategoria(e.target.checked)}
                                    disabled={categoriasPrincipais.length <= 0}
                                />
                                Subcategoria
                            </label>
                        </div>

                        {ehSubcategoria && (
                            <div>
                                <label className={styles.label} htmlFor="categoriaPai">Referente a:</label>
                                <select 
                                    className={styles.input}
                                    name="categoriaPai" 
                                    id="categoriaPai"
                                    value={categoriaPai}
                                    onChange={(e) => setCategoriaPai(e.target.value)}
                                    required={ehSubcategoria}

                                >
                                    <option value="">Selecione uma categoria</option>
                                    {categoriasPrincipais.map(categoria => (
                                        <option key={categoria.id_categoria} value={categoria.id_categoria}>
                                            {categoria.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <button className={styles.submitButton} type="submit" disabled={criando}>Criar</button>
                    </form>
                </div>
            </div>
        </>
    )
}