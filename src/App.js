import { useMutation, useQuery } from "react-query";
import "./App.css";

const fetchUsers = async () => {
  try {
    const res = await fetch("https://reqres.in/api/users");
    if (!res.ok) {
      throw new Error("something went wrong");
    }
    const user = res.json();
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

const addUser = async (user) => {
  const res = await fetch("https://reqres.in/api/users", {
    method: "POST",
    body: JSON.stringify({
      first_name: user.first_name,
      last_name: user.last_name,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  if (!res.ok) {
    throw new Error("something went wrong");
  }
  return res.json();
};

function App() {
  //grab all users

  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery("users", fetchUsers);

  //create a mutation

  const {
    mutate,
    mutateAsync,
    isLoading: isAddingUser,
    error: addError,
  } = useMutation(addUser);

  const handleAddUser = async () => {
    const data = await mutateAsync({
      first_name: "huseyin",
      last_name: "soylu",
    });

    console.log("this was an async mutation");
    console.log(data);
    refetch();
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error || addError) {
    <p>something went wrong...</p>;
  }

  console.log(users);

  return (
    <div className="App">
      {isAddingUser ? <p>adding user</p> : null}
      <button onClick={handleAddUser}>add user</button>
      {users.data.map((user) => (
        <p key={user.id}>
          {user.first_name} {user.last_name}
        </p>
      ))}
    </div>
  );
}

export default App;
