import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getOrderByNumberApi } from '../../utils/burger-api';
import { OrderInfoUI } from '@ui';
import { Preloader } from '../ui/preloader';
import { TOrder, TIngredient } from '@utils-types';
import { selectIngredients } from '../../services/slices/ingredientsSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const allIngredients = useSelector(selectIngredients);
  const [order, setOrder] = useState<TOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (number) {
      getOrderByNumberApi(Number(number))
        .then((data) => {
          setOrder(data.orders[0]);
        })
        .catch((err) => console.error('Ошибка загрузки заказа:', err))
        .finally(() => setLoading(false));
    }
  }, [number]);

  if (loading) return <Preloader />;
  if (!order) return <p>Заказ не найден</p>;

  // Подготавливаем данные для OrderInfoUI
  const ingredientsInfo: { [key: string]: TIngredient & { count: number } } =
    {};
  order.ingredients.forEach((id: string) => {
    const ingredient = allIngredients.find((i: TIngredient) => i._id === id);
    if (ingredient) {
      if (!ingredientsInfo[id]) {
        ingredientsInfo[id] = { ...ingredient, count: 0 };
      }
      ingredientsInfo[id].count++;
    }
  });

  const total = Object.values(ingredientsInfo).reduce(
    (sum, item) => sum + item.price * item.count,
    0
  );

  const orderInfo = {
    ...order,
    ingredientsInfo,
    date: new Date(order.createdAt),
    total
  };

  return <OrderInfoUI orderInfo={orderInfo} />;
};
