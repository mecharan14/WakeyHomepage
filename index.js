
const init = () =>{
    let cont = document.querySelector("#linkCon");
    let html = `<a href="http://www.google.com" target="_blank"><button class="btn" style="background: linear-gradient(145deg, #fc6c6b, #fbbc05);">Google</button></a>
    <a href="http://www.youtube.com" target="_blank"><button class="btn" style="background: linear-gradient(145deg, #ec444c, #f26e73);">YouTube</button></a>
    <a href="http://www.facebook.com" target="_blank"><button class="btn" style="background: linear-gradient(145deg, #4382ea, #29b4d3);">Facebook</button></a>
    <a href="http://www.instagram.com" target="_blank"><button class="btn" style="background: linear-gradient(145deg, #4285f4, #ea4335);">Instagram</button></a>`;
    if(localStorage.getItem("data")){
        let data = JSON.parse(localStorage.getItem("data"));
        data.forEach(i => {
            html += `<a href="${i['link']}" target="_blank"><button class="btn">${i['name']}</button></a>`
        })
    }
    html += `<a href="#"><button class="btn" onclick="addNew()">+</button></a>`;
    cont.innerHTML = html;
}

init();

const checkPass = () => {
    const el = document.querySelector("#pass");
    if(el.value == "8143"){
        document.querySelector("#lock").style.display = "none";
    }
}

const addNew = () =>{
    let box = document.querySelector("#addBox");
    box.style.display = "block";
}

const addClose = () =>{
    let box = document.querySelector("#addBox");
    box.style.display = "none";
}

const toast = (msg) =>{
    let el = document.querySelector("#toast");
    el.innerHTML = msg;
    el.style.opacity = "1";
    el.style.bottom = "0";
    setTimeout(()=>{
        el.style.opacity = "0";
        el.style.bottom = "-20%";
    },2000)
}

const addComp = () => {
    let name = document.querySelector("#addName").value;
    let link = document.querySelector("#addLink").value;

    let obj = {
        name,
        link
    };

    if(localStorage.getItem("data")){
        let data = localStorage.getItem("data");
        data = JSON.parse(data);
        data.push(obj);
        data = JSON.stringify(data);
        localStorage.setItem("data", data);
        
    }else{
        let arr = [];
        arr.push(obj);
        let data = JSON.stringify(arr);
        localStorage.setItem("data", data);
        
    }

    init();

    

    document.querySelector("#addName").value = "";
    document.querySelector("#addLink").value = "";
    addClose();

    toast("Added Successfully");

}

const delSome = ()=>{
    let name = prompt("Enter website name ");
    let data = JSON.parse(localStorage.getItem("data"));
    data.forEach((key, index) =>{
        if(key['name'] == name){
            let con = confirm(`Do you really want to delete ${name}?`);
            if(con == true){
                data.splice(index, 1);
                toast("Deleted Successfully")
            }
            
            
        }
    })
    localStorage.setItem("data", JSON.stringify(data));
    init();
}


const getTodos = () => {
    let data = localStorage.getItem('todos');
    let html = "";
    if( data && JSON.parse(data).length > 0){
        data = JSON.parse(data)
        data.forEach(item => {
            html += `<div class="todoItem">${item.title} <button onclick="delTodo(${item.id})">-</button></div>`
        })
    }else{
        html = `<br><p>*empty*</p>`
    }

    document.querySelector('.todos').innerHTML = html;
}

getTodos()

const addTodo = () => {
    let todo = prompt("Enter the todo: ");
    let data = localStorage.getItem('todos');
    if( data && JSON.parse(data).length > 0){
        data = JSON.parse(data);
        try{
            id = data[data.length-1].id + 1;
        }catch(err){
            id = 0;
        }
        
        let obj = {
            id,
            title: todo
        }
        data.push(obj)
    }else{
        data = [{
            id: 0,
            title: todo
        }]
    }
    localStorage.setItem('todos', JSON.stringify(data))
    getTodos()

}

const delTodo = (id) => {
    let data = JSON.parse(localStorage.getItem('todos'))
    data.forEach((item, i) => {
        if(item.id == id){
            data.splice(i, 1)
            return;
        }
    })
    localStorage.setItem('todos', JSON.stringify(data))
    getTodos();
}

