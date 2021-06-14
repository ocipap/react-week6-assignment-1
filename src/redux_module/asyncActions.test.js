import configureStore from 'redux-mock-store';
import { getDefaultMiddleware } from '@reduxjs/toolkit';

import {
  loadCategories,
  loadRegions,
  loadRestaurants,
  loadRestaurantInfo,
} from './asyncActions';
import {
  setCategories,
  setRegions,
  setSelectedRestaurants,
  setSelectedRestaurant,
} from './RestaurantSlice';
import {
  fetchCategories,
  fetchRegions,
  fetchRestaurants,
  fetchRestaurantInfo,
} from '../services/api';

jest.mock('../services/api');

describe('asyncActions', () => {
  const mockStore = configureStore(getDefaultMiddleware());

  describe('loadCategories', () => {
    beforeAll(() => {
      fetchCategories.mockImplementation(async () => [
        { id: 1, name: '한식' },
        { id: 2, name: '중식' },
      ]);
    });

    it('fetches categories when being dispatched', async () => {
      const store = mockStore({});
      await store.dispatch(loadCategories());

      const actions = store.getActions();
      expect(actions[0]).toEqual(setCategories([
        { id: 1, name: '한식' },
        { id: 2, name: '중식' },
      ]));
    });
  });

  describe('loadRegions', () => {
    beforeAll(() => {
      fetchRegions.mockImplementation(
        async () => [
          { id: 1, name: '서울' },
          { id: 2, name: '대전' },
        ],
      );
    });

    it('fetches regions when being dispatched', async () => {
      const store = mockStore({});
      await store.dispatch(loadRegions());

      const actions = store.getActions();

      expect(actions[0]).toEqual(setRegions([
        { id: 1, name: '서울' },
        { id: 2, name: '대전' },
      ]));
    });
  });

  describe('loadRestaurants', () => {
    beforeAll(() => {
      fetchRestaurants.mockImplementation(async (regionName, categoryId) => {
        if (regionName === '서울' && categoryId === 1) {
          return [
            { id: 1, title: '양천주가' },
          ];
        }

        return null;
      });
    });

    it('fetches restuarants when being dispatched', async () => {
      const store = mockStore({
        restaurant: {
          selected: {
            category: { id: 1, name: '한식' },
            region: { id: 1, name: '서울' },
          },
        },
      });

      await store.dispatch(loadRestaurants());

      const actions = store.getActions();

      expect(actions[0]).toEqual(setSelectedRestaurants([
        { id: 1, title: '양천주가' },
      ]));
    });
  });

  describe('loadRestaurantInfo', () => {
    beforeAll(() => {
      fetchRestaurantInfo.mockImplementation(async () => ({
        name: '양천주가',
        address: '서울 강남구',
        menuItems: ['비빔밥'],
      }));
    });

    it('fetches restuarantInfo when being dispatched', async () => {
      const store = mockStore({});
      await store.dispatch(loadRestaurantInfo(1));

      const actions = store.getActions();

      expect(actions[0]).toEqual(setSelectedRestaurant({
        name: '양천주가',
        address: '서울 강남구',
        menuItems: ['비빔밥'],
      }));
    });
  });
});