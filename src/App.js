import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [isClicked, setIsClicked] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [frdSelected, setFrdSelected] = useState({});
  const [addFriend, setAddFriend] = useState(false);

  const handleDisplaySetFriends = function (frd) {
    setFriends((friends) => [...friends, frd]);
    setAddFriend(false);
  };

  function handleSetFriends(balance) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === frdSelected.id
          ? { ...friend, balance: balance + friend.balance }
          : friend
      )
    );
  }

  function handleIsClicked(id) {
    setIsClicked(true);

    if (id) {
      setFrdSelected(friends.find((friend) => friend.id === id));
    }
  }

  const displayAddFriend = function () {
    setAddFriend((addFriend) => !addFriend);
  };

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList onIsClicked={handleIsClicked} friends={friends} />
        {addFriend && (
          <AddFriend onDisplaySetFriends={handleDisplaySetFriends} />
        )}

        <Button setAddFriend={displayAddFriend}>
          {addFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {isClicked && (
        <SplitBill
          isClicked={isClicked}
          frdSelected={frdSelected}
          onSetFriends={handleSetFriends}
          key={frdSelected.id}
        />
      )}
    </div>
  );
}

function FriendList({ friends, onIsClicked }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend friend={friend} key={friend.id} onIsClicked={onIsClicked} />
      ))}
    </ul>
  );
}

function Friend({ friend, onIsClicked }) {
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance === 0 ? (
        <p> You and {friend.name} are even </p>
      ) : friend.balance > 0 ? (
        <p className="green">
          {" "}
          {friend.name} owes you {friend.balance}$
        </p>
      ) : (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}

      <button className="button" onClick={onIsClicked.bind(null, friend.id)}>
        Select
      </button>
    </li>
  );
}

function Button({ setAddFriend, children }) {
  return (
    <button className="button" onClick={setAddFriend}>
      {children}
    </button>
  );
}

function AddFriend({ onDisplaySetFriends }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  const addFriendForm = function (e) {
    e.preventDefault();
    let newFriend;
    let id = crypto.randomUUID();

    if (!name || !image) return;

    newFriend = {
      name,
      image: `${image}?= ${id}`,
      balance: 0,
      id,
    };

    // crypto.randomUUID() - for random IDs

    onDisplaySetFriends(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  };

  return (
    <div>
      <form className="form-add-friend" onSubmit={addFriendForm}>
        <label>🧑‍🤝‍🧑Friend name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>💂Image URL</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <button className="button">Add</button>
      </form>
    </div>
  );
}

function SplitBill({ frdSelected, isClicked, onSetFriends }) {
  const [input, setInput] = useState({
    bill: "",
    yourExpense: "",
    frdExpense: "",
  });

  const [billPay, setBillPay] = useState("You");

  const handleSetInput = function (value, billAmount) {
    setInput((input) => ({ ...input, [value]: billAmount }));
  };

  const handleSplitBillForm = function (e) {
    e.preventDefault();

    if (!input) return;

    const balance =
      billPay === "You"
        ? input.bill - input.yourExpense
        : input.frdExpense - input.bill;

    // console.log(balance);

    onSetFriends(balance, frdSelected.id);

    setInput({
      bill: "",
      yourExpense: "",
      frdExpense: "",
    });

    setBillPay("you");
  };

  if (isClicked)
    return (
      <form className="form-split-bill" onSubmit={handleSplitBillForm}>
        <h2>split a bill with {frdSelected.name}</h2>

        <label>💰Bill value</label>
        <Input onSetInput={handleSetInput.bind(null, "bill")}>
          {input.bill}
        </Input>

        <label>💂Your expense</label>
        <Input onSetInput={handleSetInput.bind(null, "yourExpense")}>
          {input.yourExpense}
        </Input>

        <label>🧑‍🤝‍🧑{frdSelected.name} 's expense</label>
        <Input onSetInput={handleSetInput.bind(null, "frdExpense")}>
          {input.frdExpense}
        </Input>

        <label>🤑Who is playing the bill?</label>
        <select value={billPay} onChange={(e) => setBillPay(e.target.value)}>
          <option value="You">You</option>
          <option value={frdSelected.name}>{frdSelected.name}</option>
        </select>

        <button className="button">Split bill</button>
      </form>
    );
}

function Input({ onSetInput, children }) {
  return (
    <input
      type="text"
      value={children}
      onChange={(e) => onSetInput(e.target.value)}
    />
  );
}
