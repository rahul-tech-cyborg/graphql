import logo from './logo.svg';
import './App.css';
import { useQuery,gql } from '@apollo/client';

const query = gql`
  query GetAllTodos{
    getTodos{
      title
      id
      user{
        name
        phone
        email
      }
    }
  }
`

function App() {
  const {data,loading} = useQuery(query);
  if(loading){
    return(
      <div>Loading...</div>
    )
  }
  return <div>{ JSON.stringify(data)}</div>
}

export default App;
