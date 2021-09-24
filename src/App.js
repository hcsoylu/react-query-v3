import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import "./App.css";

const fetchInfiniteUsers = async ({ pageParam = 1 }) => {
  try {
    const res = await fetch(`https://reqres.in/api/users?page=${pageParam}`);
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
  // call the useQueryClient hook

  const queryClient = useQueryClient();

  //grab all users

  const { data, isLoading, isFetching, fetchNextPage, hasNextPage, error } =
    useInfiniteQuery("users", fetchInfiniteUsers, {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.page < lastPage.total_pages) return lastPage.page + 1;
        return false;
      },
    });

  //create a mutation

  const {
    mutate,
    mutateAsync,
    isLoading: isAddingUser,
    error: addError,
  } = useMutation(addUser);

  const handleAddUser = async () => {
    const newUser = await mutateAsync({
      first_name: "huseyin",
      last_name: "soylu",
    });

    console.log("this was an async mutation");
    console.log(newUser);
    queryClient.setQueryData("users", (oldData) => ({
      ...oldData,
      data: [newUser, ...oldData.data],
    }));
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error || addError) {
    <p>something went wrong...</p>;
  }

  console.log(data);

  return (
    <div className="App">
      {isAddingUser ? <p>adding user</p> : null}
      <button onClick={handleAddUser}>add user</button>
      {data.pages.map((page) =>
        page.data.map((user) => (
          <p key={user.id}>
            {user.first_name} {user.last_name}
          </p>
        ))
      )}
      {isFetching && <p>loading...</p>}
      {hasNextPage && <button onClick={fetchNextPage}>Load more</button>}
    </div>
  );
}

export default App;
