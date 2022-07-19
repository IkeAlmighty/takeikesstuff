import S3Image from "../components/S3Image";

export default function Item({ objectData, onClaim, onRemove }) {
  return (
    <div className="border-2 border-black pb-2 mb-10 bg-zinc-200 rounded p-3">
      <S3Image imageKey={objectData.key} className="h-[300px] mb-3" />
      <div className="my-3">{objectData.label}</div>

      {/* 
        only show the Claim button if a callback property exists for it 
      */}
      {onClaim && (
        <button
          className="bg-slate-100"
          onClick={() => onClaim(objectData.key)}
        >
          CLAIM
        </button>
      )}

      {onRemove && (
        <button
          className="bg-slate-100"
          onClick={() => onRemove(objectData.key)}
        >
          REMOVE
        </button>
      )}
    </div>
  );
}
