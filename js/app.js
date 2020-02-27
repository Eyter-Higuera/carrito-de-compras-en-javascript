//Variables
 const carrito = document.getElementById('carrito');
 const cursos = document.getElementById('lista-cursos');
 const listaCursos = document.querySelector('#lista-carrito tbody'); 
 const vaciarCarritoBtn = document.getElementById('vaciar-carrito');


//Listeners

cargarEventListeners();

function cargarEventListeners(){
     //Dispara cuando se presiona "Agregar Carrito"
     cursos.addEventListener('click', comprarCurso);

     //cuando se elimina un curso del carrito
     carrito.addEventListener('click', eliminarCurso);

     //Al vaciar el carrito
     vaciarCarritoBtn.addEventListener('click', vaciarCarrito);

     //Al cargar el documento, mostrar LocalStorage (esto para evitar que se borren cuando se refresque la pagina)
     document.addEventListener('DOMContentLoaded', leerLocalStorage);
      
}



//Funciones

function comprarCurso(e){
    
      e.preventDefault();
       //Delegation para agregar-carrito
       if(e.target.classList.contains('agregar-carrito')){

         const curso = e.target.parentElement.parentElement;
          //Enviamos el curso seleccionado para tomar sus datos  
          leerDatosCurso(curso);
       }    
       
}

//Lee los datos del curso
function leerDatosCurso(curso){
       
     const infoCurso = {
          imagen: curso.querySelector('img').src,
          titulo: curso.querySelector('h4').textContent,
          precio: curso.querySelector('.precio span').textContent,
          id: curso.querySelector('a').getAttribute('data-id')
     }

     //console.log(infoCurso);

      insertarCarrito(infoCurso);
}


//Muestra el curso seleccionado en el Carrito
function  insertarCarrito(curso){
   
      const row = document.createElement('tr');
      row.innerHTML= `
      
          <td>
               <img src="${curso.imagen}" width=100>
      
          </td>
          <td>${curso.titulo}</td>
          <td>${curso.precio}</td>
          <td>
              <a href="#" class="borrar-curso" data-id="${curso.id}"> X </a>
          </td>
      `;

      listaCursos.appendChild(row);
      guardarCursoLocalStorage(curso);
       
}

//Elimina el curso del carrito en el DOM y del local storage con el metodo eliminarCursoLocalStorage
function eliminarCurso(e){

       e.preventDefault();

       //console.log("eliminado");

       let curso,
           cursoId;
       if(e.target.classList.contains('borrar-curso')){
               
            //console.log(e.target.parentElement.parentElement);
            //lo elimina del DOM
            e.target.parentElement.parentElement.remove();
            //proceso para obtener el id del curso para eliminar el curso del local storage
            curso = e.target.parentElement.parentElement;
            cursoId = curso.querySelector('a').getAttribute('data-id');

            //console.log(cursoId);
       }

       eliminarCursoLocalStorage(cursoId);
}

//elimina los curso del carrito del DOM
function vaciarCarrito(){

     //forma lenta
     //listaCursos.innerHTML = "";
     //forma recomendada
     while(listaCursos.firstChild){
             
          listaCursos.removeChild(listaCursos.firstChild);
     }
     
     
     //vaciar local storage
     vaciarLocalStorage();

     return false;

}

//Almacena cursos en el carrito a Local Storage

function guardarCursoLocalStorage(curso){

       //console.log(curso);

       let cursos;
       //toma el valor de un arreglo con datos de LS o vacío
       cursos =  obtenerCursosLocalStorage();

       //console.log(cursos);

       //el curso seleccionado se agrega al arreglo
       cursos.push(curso);
       
       //JSON.stringify = convierte un arreglo en un string
       localStorage.setItem('cursos', JSON.stringify(cursos) );
}


//Comprueba que haya elementos en Local Storage
function obtenerCursosLocalStorage(){

       let cursosLS;

       //comprobamos si hay algo en localStorage
       if(localStorage.getItem('cursos') ===null){
          
           cursosLS = [];
       
        } else {
          
          //JSON.parse= lo que venga como string lo convierta en un arreglo en javascript
          cursosLS = JSON.parse(localStorage.getItem('cursos'));
        }

        return cursosLS;
}

//Imprime los cursos de Local Storage en el carrito
function leerLocalStorage(){

     let cursosLS;
     cursosLS =  obtenerCursosLocalStorage();
     //console.log(cursosLS);
     
     //recorre el array cursosLS (contiene los atributos id,imagem,titulo,precio) y lo guarda en el objeto curso
     cursosLS.forEach(function(curso){
           
           //construir el template
           const row = document.createElement('tr');
           row.innerHTML= `
           
               <td>
                    <img src="${curso.imagen}" width=100>
           
               </td>
               <td>${curso.titulo}</td>
               <td>${curso.precio}</td>
               <td>
                   <a href="#" class="borrar-curso" data-id="${curso.id}"> X </a>
               </td>
           `;
     
           listaCursos.appendChild(row);
           
     });

}


//Eliminar el curso por el ID en Local Storage

function eliminarCursoLocalStorage(curso){

     // console.log(curso);

     let cursoLS;
     //obtenemos el arreglo de cursos
     cursosLS = obtenerCursosLocalStorage();

     //iteramos comparando el ID del curso borrado con los del LS
     cursosLS.forEach(function(cursoLS,index){
           
          //si el id que estamos recorriendo es igual al id que hemos seleccionado para eliminar entonces lo elimina del array cursosLS
            if(cursoLS.id === curso){
               //el parametro index es para saber cual indice es el que se va a eliminar del array cursosLS y el "1" quiere decir el numero de elementos a eliminar del array
                cursosLS.splice(index,1);
            }
     });

      //console.log(cursosLS);

     //Añadimos el arreglo actual a storage ya que eliminanos un elemento del array y debemos actualizarlo en el array del storage
      localStorage.setItem('cursos', JSON.stringify(cursosLS) );

}

//Elimina todos los cursos de local storage

function vaciarLocalStorage(){

     localStorage.clear();
}