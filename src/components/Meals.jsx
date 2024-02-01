import useHttp from "../Hooks/useHttp"
import MealItem from "./MealItem";
import Error from "./Error";

const requestedConfig = {};

export default function Meals(){

const {
    data: loadedMeals,
    isLoading,
    error,
    } = useHttp('http://localhost:3000/meals', requestedConfig, []);

    if(isLoading){
        return <p className="center">Fetching Meals...</p>;
    }

    if(error){
        return <Error title=" Failed to fetch meals" message={error}></Error>;
    }
    
    return(
    <ul id="meals">
        {loadedMeals.map((meal) => (
            <MealItem key={meal.id} meal={meal}/>
        ))}
        </ul>
    );
   
}




    // const [loadedMeals, setLoadedMeals] = useState([]);

    // useEffect(() => {
    //     async function fetchMeals(){
    //         const  response = await fetch('http://localhost:3000/meals');
  
    //         if(response.ok){
    //           // ...
    //         }
    //         const meals = await response.json();
    //         setLoadedMeals(meals);
    //   }
    //   fetchMeals();
    // },[])
