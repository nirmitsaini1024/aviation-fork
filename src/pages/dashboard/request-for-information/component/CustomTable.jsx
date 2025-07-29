import { useState } from "react"
import { Card } from "@/components/ui/card"

export default function CustomTable({tabelDataFirst}) {
  const [tableData, setTableData] = useState(tabelDataFirst)

  const updateCellContent = (rowIndex, columnType, cellIndex, newContent) => {
    setTableData((prevData) => {
      const newData = [...prevData]
      const row = { ...newData[rowIndex] }

      if (columnType === "event" || columnType === "investigation") {
        ;(row[columnType]).content = newContent
      } else {
        const cellArray = [...(row[columnType])]
        cellArray[cellIndex] = { ...cellArray[cellIndex], content: newContent }
        row[columnType] = cellArray
      }

      newData[rowIndex] = row
      return newData
    })
  }

  const EditableCell = ({
    content,
    onUpdate,
    className = "",
  }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState(content)

    const handleClick = () => {
      setIsEditing(true)
      setEditContent(content)
    }

    const handleBlur = () => {
      setIsEditing(false)
      onUpdate(editContent)
    }

    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleBlur()
      }
      if (e.key === "Escape") {
        setIsEditing(false)
        setEditContent(content)
      }
    }

    return (
      <div className={`min-h-[40px] ${className}`}>
        {isEditing ? (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full h-full p-2 border-none outline-none resize-none bg-transparent"
            autoFocus
            rows={Math.max(1, editContent.split("\n").length)}
          />
        ) : (
          <div
            onClick={handleClick}
            className="p-2 cursor-pointer hover:bg-black/5 rounded min-h-[36px] flex items-center"
            title="Click to edit"
          >
            {content || "Click to edit"}
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className="w-full max-w-6xl mx-auto p-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="border border-gray-300 p-3 text-left font-semibold">Event</th>
              <th className="border border-gray-300 p-3 text-left font-semibold">Investigation</th>
              <th className="border border-gray-300 p-3 text-left font-semibold">Who to notify</th>
              <th className="border border-gray-300 p-3 text-left font-semibold">Timeframe</th>
              <th className="border border-gray-300 p-3 text-left font-semibold">Documentation</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-blue-50" : "bg-white"}>
                <td className="border border-gray-300 align-top">
                  <EditableCell
                    content={row.event.content}
                    onUpdate={(newContent) => updateCellContent(rowIndex, "event", 0, newContent)}
                  />
                </td>
                <td className="border border-gray-300 align-top">
                  <EditableCell
                    content={row.investigation.content}
                    onUpdate={(newContent) => updateCellContent(rowIndex, "investigation", 0, newContent)}
                  />
                </td>
                <td className="border border-gray-300 align-top">
                  <div className="space-y-1">
                    {row.whoToNotify.map((cell, cellIndex) => (
                      <EditableCell
                        key={cell.id}
                        content={cell.content}
                        onUpdate={(newContent) => updateCellContent(rowIndex, "whoToNotify", cellIndex, newContent)}
                      />
                    ))}
                  </div>
                </td>
                <td className="border border-gray-300 align-top">
                  <div className="space-y-1">
                    {row.timeframe.map((cell, cellIndex) => (
                      <EditableCell
                        key={cell.id}
                        content={cell.content}
                        onUpdate={(newContent) => updateCellContent(rowIndex, "timeframe", cellIndex, newContent)}
                      />
                    ))}
                  </div>
                </td>
                <td className="border border-gray-300 align-top">
                  <div className="space-y-1">
                    {row.documentation.map((cell, cellIndex) => (
                      <div key={cell.id} className="flex items-start">
                        <span className="text-gray-600 mr-2 mt-2">•</span>
                        <EditableCell
                          content={cell.content}
                          onUpdate={(newContent) => updateCellContent(rowIndex, "documentation", cellIndex, newContent)}
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>
          <strong>Instructions:</strong> Click on any cell to edit its content. Press Enter to save, or Escape to
          cancel.
        </p>
      </div>
    </Card>
  )
}
