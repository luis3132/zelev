import { FC, useState } from "react";
import { Anadir, ChevronDownIcon, ChevronUpIcon, FilterIcon } from "../icons/icons";
import { Categoria } from "@/lib/types/types";

interface FiltersComponentProps {
    toggleCategory: (categoryId: number) => void;
    handleSelectCategory: (categoryId: number) => void;
    expandedCategories: Record<number, boolean>;
    selectedCategories: Record<number, boolean>;
    categoriasPadre: Categoria[];
    categories: Categoria[];
    showAnadir: boolean;
}

const FiltersComponent: FC<FiltersComponentProps> = ({ categoriasPadre, categories, expandedCategories, handleSelectCategory, selectedCategories, toggleCategory, showAnadir }) => {

    const [showFilters, setShowFilters] = useState(false);

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const color = (expanded: boolean, select: boolean, category?: boolean) => {
        if (select) {
            return "bg-gray-600 text-white";
        }
        if (expanded) {
            return "bg-black text-white";
        }
        if (category) {
            return "bg-white/30 text-white";
        }
        if (!category) {
            return "bg-white/10"
        }
    }

    return (
        <>
            <aside className="md:w-1/5 md:h-full p-4 md:border-r max-md:border-b border-gray-300 max-md:flex justify-between items-center max-h-full overflow-y-scroll">
                <section className="flex w-full items-center justify-between md:mb-4">
                    <h2 className="font-bold text-lg">Filtros</h2>
                    {showAnadir && (
                        <button
                            className="flex items-center justify-center bg-green-600 text-white px-2 py-1 rounded gap-2"
                            onClick={() => alert("Añadir algo")}
                        >
                            <Anadir />
                            Añadir
                        </button>
                    )}
                    <button
                        className="md:hidden flex items-center justify-center bg-blue-500 text-white px-2 py-2 rounded gap-2"
                        onClick={toggleFilters}
                    >
                        Filtros
                        <FilterIcon />
                    </button>
                </section>
                <main className={`max-md:fixed max-md:top-0 max-md:w-full max-md:h-dvh max-md:pb-16 transition-all duration-300 ${showFilters ? "max-md:left-0" : "max-md:left-full"} max-md:bg-black/50 backdrop-blur-xs max-md:p-4 max-md:overflow-y-scroll`}>
                    <div className="mb-6">
                        <h3 className="font-semibold text-md mb-2">Categorías</h3>
                        <button
                            className="absolute top-4 right-4 bg-red-500 text-white px-2 py-0.5 rounded-full md:hidden"
                            onClick={toggleFilters}
                        >
                            X
                        </button>
                        <ul className="space-y-2">
                            {categoriasPadre.map(category => (
                                <li key={category.idCategoria} className={`${color(expandedCategories[category.idCategoria], selectedCategories[category.idCategoria])} rounded-2xl gap-1`}>
                                    <div
                                        className="flex items-center justify-between px-4 bg-black/60 py-2 cursor-pointer rounded-2xl w-full"
                                        onClick={() => toggleCategory(category.idCategoria)}
                                    >
                                        <div className="flex items-center">
                                            <button className="px-4 rounded-2xl bg-white/10" onClick={() => handleSelectCategory(category.idCategoria)}>{category.categoria}</button>
                                        </div>
                                        {expandedCategories[category.idCategoria] ? (
                                            <ChevronUpIcon />
                                        ) : (
                                            <ChevronDownIcon />
                                        )}
                                    </div>
                                    <ul className={`space-y-2 transition-all duration-300 ${expandedCategories[category.idCategoria] ? "h-auto mx-6 mt-2 pb-2" : "h-0 overflow-hidden"}`}>
                                        {categories.filter(c => c.categoria === category.categoria && c.subcategoria !== "").map(subcategory => (
                                            <li key={subcategory.idCategoria} className={`${color(false, false, selectedCategories[subcategory.idCategoria])} w-full rounded-2xl px-4`}>
                                                <button className="w-full" onClick={() => handleSelectCategory(subcategory.idCategoria)}>{subcategory.subcategoria}</button>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </div>
                </main>
            </aside>
        </>
    )
}

export default FiltersComponent;