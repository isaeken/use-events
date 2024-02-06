import React, {Context, createContext, ReactNode, useContext, useEffect, useState} from 'react';
import { Collection } from '../collection';

interface ContextType {
  useCollection<T>(name: string): Collection<T>;
}

const EventsContext: Context<ContextType> = createContext<ContextType>({} as ContextType);

export const useEvents = () => useContext<ContextType>(EventsContext);

export function EventsContextProvider({ children }: { children: ReactNode }) {
  const [collections, setCollections] = useState<Record<string, Collection<any>>>({});

  const useCollection: ContextType['useCollection'] = (name) => {
    if (!collections[name]) {
      const collection = new Collection<any>(name);

      setCollections((collections) => ({
        ...collections,
        [name]: collection,
      }));

      return collection;
    }

    return collections[name];
  };

  useEffect(() => {
    for (const [name, collection] of Object.entries(collections)) {
      const refresh = () => {
        setCollections((collections) => ({
          ...collections,
          [name]: collection,
        }));
      };

      collection.events.on('create', refresh);
      collection.events.on('update', refresh);
      collection.events.on('destroy', refresh);
    }

    return () => {
      for (const [, collection] of Object.entries(collections)) {
        collection.events.removeAllListeners();
      }
    };
  }, [collections]);

  return (
    <EventsContext.Provider
      value={{
        useCollection,
      }}>
      {children}
    </EventsContext.Provider>
  );
}
