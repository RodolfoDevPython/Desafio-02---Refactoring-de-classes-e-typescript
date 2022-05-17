import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

type FoodType = {
  id: number,
  name: string,
  description: string,
  price: string,
  available: boolean,
  image: string
}

function Dashboard() {

  const [foods, setFoods] = useState<FoodType[]>([]);
  const [editingFood, setEditingFood] = useState<FoodType | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(true);

  useEffect( () => {

    async function fetchData() {
      const response = await api.get('/foods');

      setFoods(response.data);
    }

    fetchData();

  }, [])


  async function handleAddFood(food: FoodType) {

    try {

      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      const respFood: FoodType = response?.data

      setFoods([...foods, respFood]);

    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: FoodType) {
    
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood?.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);

    } catch (err) {
      console.log(err);
    }

  }

  async function handleDeleteFood(id: number) {

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal() {

    setModalOpen(!modalOpen);

  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: FoodType) {
    setEditingFood(food);
    setEditModalOpen(!editModalOpen);
  }

  return (
    <>

      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );

};

export default Dashboard;
