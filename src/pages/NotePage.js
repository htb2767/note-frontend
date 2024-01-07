import React,{useState,useEffect} from 'react'
import { useParams,useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {ReactComponent as ArrowLeft} from '../assets/arrow-left.svg'
function NotePage() {
    const { id } = useParams();
    let noteId=id;
    let navigate=useNavigate()
    let[note,setNote]=useState(null)
    useEffect(()=>{
        getNote()

    },[noteId])
    let getCookie=(name)=> {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
      }
    let getNote = async()=>{
        if(noteId==='new') return;
        let response=await fetch(`https://noteapp-ts8w.onrender.com/api/notes/${noteId}/`)
        let data=await response.json()
        setNote(data)
    }
    let updateNote = async () => {
        var csrftoken=getCookie('csrftoken');
        fetch(`https://noteapp-ts8w.onrender.com/api/notes/${noteId}/`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken':csrftoken,
            },
            body: JSON.stringify(note)
        })
    }
    let createNote = async () => {
        var csrftoken=getCookie('csrftoken');
        fetch(`https://noteapp-ts8w.onrender.com/api/notes/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken':csrftoken,
            },
            body: JSON.stringify(note)
        })
    }
    let handleChange=(e)=>{
        let value=e.target.value
        setNote({
            ...note,
            body:value

        })
    }
    
    let deleteNote = async()=>{
        var csrftoken=getCookie('csrftoken');
        fetch(`https://noteapp-ts8w.onrender.com/api/notes/${noteId}/`,{
            method:'DELETE',
            headers:{
                'Content-Type': 'application/json',
                'X-CSRFToken':csrftoken,

            },
        })
        navigate('/')

    }
    let handleSubmit=()=>{
        if(noteId!=='new' && note.body===''){
            deleteNote()
        }else if(noteId!=='new'){
            updateNote()

        }else if(noteId==='new' &&note!==null){
            createNote()
        }
        
        navigate('/')
    }

  return (
    <div className='note'>
        <div className='note-header'>
            <h3>
                <ArrowLeft onClick={handleSubmit}/>
                
                
            </h3>
            {
                noteId!=='new'? (<button onClick={deleteNote}>Delete</button>):
                (<button onClick={handleSubmit}>Done</button>)

            }
            
            

        </div>
        <textarea onChange={handleChange} value={note?.body}></textarea>
      
    </div>
  )
}

export default NotePage
