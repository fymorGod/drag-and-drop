import React, { useState } from "react";
import dynamic from "next/dynamic";
import { DragDropContext } from "react-beautiful-dnd";
const Column = dynamic(() => import('../src/Column'), {ssr: false});

const reorderColumnList = ( sourceCol, startIndex, endIndex) => {
  const newTaskIds = Array.from(sourceCol.taskIds);
  const [ removed ] = newTaskIds.splice(startIndex, 1);
  newTaskIds.splice(endIndex, 0, removed); 

  const newColumn = {
    ...sourceCol,
    taskIds: newTaskIds,
  }
  return newColumn; 
}

const initialData = {
  tasks: {
    1: { id: 1, content: "Configure Next.js application" },
    2: { id: 2, content: "Configure Next.js and tailwind " },
    3: { id: 3, content: "Create sidebar navigation menu" },
    4: { id: 4, content: "Create page footer" },
    5: { id: 5, content: "Create page navigation menu" },
    6: { id: 6, content: "Create page layout" },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "TO-DO",
      taskIds: [1, 2, 3, 4, 5, 6],
    },
    "column-2": {
      id: "column-2",
      title: "IN-PROGRESS",
      taskIds: [],
    },
    "column-3": {
      id: "column-3",
      title: "COMPLETED",
      taskIds: [],
    },
  },
  // Facilitate reordering of the columns
  columnOrder: ["column-1", "column-2", "column-3"],
};

export default function Home() {
  const [state, setState] = useState(initialData);

  const onDragEnd = (result) => {
    const { destination, source } = result;
    // if user tries to drop in an unknown destination
    if(!destination) return ;

    // if the user drags and drops back in the same position
    if(destination.droppableId === source.droppableId && destination.index === source.index) {
      return ;
    }

    // if the user drops whitin the same column but in a different position
    const sourceCol = state.columns[source.droppableId]; 
    const destinationCol = state.columns[destination.droppableId];

    if(sourceCol.id === destinationCol.id) {
      const newColumn = reorderColumnList(
        sourceCol,
        source.index,
        destination.index
      )

      const newState = { 
        ...state,
        columns: { 
          ...state.columns,
          [newColumn.id]: newColumn
        },
      }
      setState(newState);
      return ;
    }

    //if the user mover from one column to another
    const startTaskIds = Array.from(sourceCol.taskIds);
    const [ removed ] = startTaskIds.splice(source.index, 1);
    const newStartCol = {
      ...sourceCol,
     taskIds: startTaskIds, 
    }

    const endTaskIds = Array.from(destinationCol.taskIds);
    endTaskIds.splice(destination.index, 0, removed);
    const newEndCol = {
      ...destinationCol,
      taskIds: endTaskIds
    }

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol
      }
    };

    setState(newState);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="h-screen w-full bg-[#121312] flex flex-col px-32">
        <div className="flex flex-col items-center">
          <div className="text-gray-100 font-semibold text-3xl pt-3">
            Teste drag and drop
          </div>
          <div className="text-gray-300">
            <p>react-beautiful-dnd lib</p>
          </div>
        </div>

        <div className="flex justify-between px-10 pt-10">
          {
            state.columnOrder.map((columnId) => {
              const column = state.columns[columnId];
              const tasks = column.taskIds.map(taskId => state.tasks[taskId]);

              return <Column key={column.id} column={column} tasks={tasks}/>;
            })
          }
        
        </div>
      </div>
    </DragDropContext>
  );
}