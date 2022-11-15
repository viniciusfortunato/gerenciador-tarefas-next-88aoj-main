/* eslint-disable @next/next/no-img-element */
import type {NextPage} from 'next';
import { useState } from 'react';
import { executeRequest } from '../services/api';
import { Modal } from 'react-bootstrap';

type LoginProps = {
    setAccessToken(s:string) : void
}
export const Login : NextPage<LoginProps> = ({setAccessToken}) =>{

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);

    const closeModal = () => {
        setShowModal(false);
    }

    const doLogin = async() => {
        try{
            if(!email || !password){
                return setError('Favor preencher os campos.');
            }

            setLoading(true);

            const body = {
                login: email,
                password
            };

            const result = await executeRequest('login', 'POST', body);
            if(result && result.data){
               localStorage.setItem('accessToken', result.data.token);
               localStorage.setItem('name', result.data.name);
               localStorage.setItem('email', result.data.email);
               setAccessToken(result.data.token);
            }
        }catch(e : any){
            console.log('Ocorreu erro ao efetuar login:', e);
            if(e?.response?.data?.error){
                setError(e?.response?.data?.error);
            }else{
                setError('Ocorreu erro ao efetuar login, tente novamente.');
            }
        }

        setLoading(false);
    }

    const doCadastro = async() => {
        setShowModal(true)     
    }

    const doSalvar = async() => {
        try {
            if (!name || !email || !password){
                return setError('Preencher todos os campos.');
            }

            if (password != password2){
                return setError('Senhas não confere.');
            }

        }catch(e : any){
            console.log('Ocorreu erro ao tentar salvar:', e);
        }

        const body = {
            name,
            email,
            password            
        };

        try {
            const res = await executeRequest('user', 'POST', body);
            setShowModal(false);
            return setError('Usuario adicionado com sucesso');

        }catch(e : any){
            return setError(e?.response?.data?.error);
        }
    }
    

    return (
        <>
            <div className='container-login'>
                <img src='/logo.svg' alt='Logo Fiap' className='logo'/>
                <div className="form">
                    {error && <p>{error}</p>}
                    <div>
                        <img src='/mail.svg' alt='Login'/> 
                        <input type="text" placeholder="Login" 
                            value={email} onChange={e => setEmail(e.target.value)}/>
                    </div>
                    <div>
                        <img src='/lock.svg' alt='Senha'/> 
                        <input type="password" placeholder="Senha" 
                            value={password} onChange={e => setPassword(e.target.value)}/>
                    </div>

                    <button type='button' onClick={doLogin} disabled={loading}>{loading ? '...Carregando' : 'Login'}</button>
                    <button type='button' onClick={doCadastro}>Cadastro</button>

                </div>
            </div>

            <Modal
                show={showModal}
                onHide={closeModal}
                className='container-modal'>
                <Modal.Body>
                        <p>Realizar cadastro</p>
                        {error && <p className='error'>{error}</p>}

                        <input type="text" placeholder="Nome" value={name} onChange={e => setName(e.target.value)}/>
                        
                        <input type="text" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)}/>
                        
                        <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)}/>

                        <input type="password" placeholder="Repetir Senha" value={password2} onChange={e => setPassword2(e.target.value)}/>

                        <button type='button' onClick={doSalvar}>Salvar</button>

                </Modal.Body>
 
            </Modal>
        </>
        
    );
}