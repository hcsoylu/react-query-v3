import { useQuery } from "react-query";
import "./App.css";

const fetchUsers = async () => {
  try {
    const res = await fetch("https://reqres.in/api/users");
    const user = await res.json();
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

function App() {
  //grab all users

  const { data: users, isLoading, error } = useQuery("users", fetchUsers);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    <p>something went wrong...</p>;
  }

  console.log(users);

  return (
    <div className="App">
      {users.data.map((user) => (
        <p key={user.id}>
          {user.first_name} {user.last_name}
        </p>
      ))}
    </div>
  );
}

export default App;
