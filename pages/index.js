import { AiOutlinePlus } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import { GoSignOut } from "react-icons/go";
import { useAuth } from "@/firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loader from "@/components/loader";
import { collection, addDoc, query, where, getDocs,deleteDoc,doc,updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";


export default function Home() {
  const [todos, setTodos] = useState(null);
  const [todoInput, setTodoInput] = useState("");

  const router = useRouter();
  const { isLoading, authUser, signOut } = useAuth();
  useEffect(() => {
    if (!authUser) {
      router.push("/login");

    }
    if(!!authUser){
        fetchTodos(authUser.uid)
    }
  }, [isLoading, authUser]);
  const addTodo = async () => {
    try {
        if(todoInput.length>0){
            const docRef = await addDoc(collection(db, "todos"), {
                completed: false,
                content: todoInput,
                ownerId: authUser.uid,
              });
              
              fetchTodos(authUser.uid)
              setTodoInput("")
        }
      
    } catch (error) {
      console.log(error);
    }
  };
  const fetchTodos = async (uid) => {
    const q = query(collection(db, "todos"), where("ownerId", "==", uid));
    const querySnapshot = await getDocs(q);
    let data=[]
    querySnapshot.forEach((doc) => {
      data.push({...doc.data(),id:doc.id})
      
    });
    setTodos(data)
  };
  const deleteTodo=async(id)=>{
    try{
        await deleteDoc(doc(db, "todos", id));
    fetchTodos(authUser.uid)
    }
    catch(error){
        console.log(error)
    }
    
  }
  const markDocChecked=async(e,id)=>{
    const docRef=doc(db,"todos",id)
    await updateDoc(docRef,{
        completed:e.target.checked
    })
    fetchTodos(authUser.uid)
  }
  const onKeyUp=(e)=>{
    if(e.key==="Enter"&&todoInput.length>0){
        addTodo()
    }
  }

  return !authUser && isLoading ? (
    <Loader />
  ) : (
    <main className="">
      <div
        onClick={signOut}
        className="bg-black text-white w-44 py-4 mt-10 rounded-lg transition-transform hover:bg-black/[0.8] active:scale-90 flex items-center justify-center gap-2 font-medium shadow-md fixed bottom-5 right-5 cursor-pointer"
      >
        <GoSignOut size={18} />
        <span>Logout</span>
      </div>
      <div className="max-w-3xl mx-auto mt-10 p-8">
        <div className="bg-white -m-6 p-3 sticky top-0">
          <div className="flex justify-center flex-col items-center">
            <span className="text-7xl mb-10">📝</span>
            <h1 className="text-5xl md:text-7xl font-bold">ToooDooo's</h1>
          </div>
          <div className="flex items-center gap-2 mt-10">
            <input
              placeholder={`👋 Hello ${authUser?.username}, What to do Today?`}
              type="text"
              className="font-semibold placeholder:text-gray-500 border-[2px] border-black h-[60px] grow shadow-sm rounded-md px-4 focus-visible:outline-yellow-400 text-lg transition-all duration-300"
              autoFocus
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
              onKeyUp={(e)=>onKeyUp(e)}
            />
            <button
              onClick={addTodo}
              className="w-[60px] h-[60px] rounded-md bg-black flex justify-center items-center cursor-pointer transition-all duration-300 hover:bg-black/[0.8]"
            >
              <AiOutlinePlus size={30} color="#fff" />
            </button>
          </div>
        </div>
        <div className="my-10">
          {todos?.length>0&&todos.map((todo, index) => (
            <div key={todo.id} className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <input
                  id={`todo-${todo.id}`}
                  onChange={(e)=>{markDocChecked(e,todo.id)}}
                  type="checkbox"
                  className="w-4 h-4 accent-green-400 rounded-lg"
                  checked={todo.completed}
                />
                <label htmlFor={`todo-${todo.id}`} className={`${todo.completed?"line-through":" "} font-medium`}>
                  {todo.content}
                </label>
              </div>

              <div onClick={()=>{
                deleteTodo(todo.id)
                
              }} className="flex items-center gap-3">
                <MdDeleteForever
                  size={24}
                  className="text-red-400 hover:text-red-600 cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
