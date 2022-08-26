import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";

const Column = ({ column, tasks }) => {
    return (
        <div className="rounded-sm bg-[#16181D] flex flex-col w-[400px] h-[620px]">
            
        <div className="flex items-center h-[60px] bg-[#1A1D23] rounded-[3px 3px 0 0] px-6 ">
          <h2 className="text-[17px] font-semibold text-[#9B9B9B]">
            {column.title}
          </h2>
        </div>
        <Droppable droppableId={column.id}>
           {(droppableProvider, droppableSnapshot) => 
           <div
            className="px-5 flex-1 flex-col" 
            ref={droppableProvider.innerRef}
             {...droppableProvider.droppableProps}
             >
                { tasks.map((task,index) => 
                <Draggable key={task.id} draggableId={`${task.id}`} index={index}>
                    { (draggableProvided, draggableSnapshot) => (
                        <div 
                        className={`mb-3 h-[72px] bg-[#242731] rounded-sm p-3 mt-3 outline-1 outline-[${draggableSnapshot.isDragging ? "#2D313E" : "none"}]`} 
                        ref={draggableProvided.innerRef} 
                        {...draggableProvided.draggableProps}
                        {...draggableProvided.dragHandleProps}
                        >
                            <h2 className="text-gray-100">{ task.content }</h2>
                        </div>
                    )}
                </Draggable>
                )
            }
            
            </div>}
        </Droppable>
      </div>
    );
};

export default Column;