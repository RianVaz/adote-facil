import { useState } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import { AnimalRegisterFormData } from '../components/AnimalRegisterForm/AnimalRegisterForm'

/**
 * Hook customizado para gerenciar o estado e lógica de upload de fotos de animais.
 * 
 * Modificação feita:
 * Extraído do componente AnimalRegisterForm para reduzir sua complexidade ("Fat Component").
 * Centraliza validações de limite de arquivos e atualização do estado do formulário.
 * Melhora o reuso caso precisemos de uma tela de edição ou outro formulário similar.
 */
export function useAnimalImages(setValue: UseFormSetValue<AnimalRegisterFormData>) {
  const [animalPictures, setAnimalPictures] = useState<File[]>([])
  const [maxPicsWarningModalOpen, setMaxPicsWarningModalOpen] = useState(false)

  const handleAnimalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploadedFiles = Array.from(e.target.files)

      if (
        uploadedFiles.length > 5 ||
        animalPictures.length + uploadedFiles.length > 5
      ) {
        setMaxPicsWarningModalOpen(true)
        return
      }

      const newPictures = [...animalPictures, ...uploadedFiles]
      setAnimalPictures(newPictures)
      setValue('pictures', newPictures)
    }
  }

  const handleRemoveAnimalPicture = (picIndex: number) => {
    const newAnimalPictures = animalPictures.filter(
      (pic, index) => picIndex !== index,
    )

    setAnimalPictures(newAnimalPictures)
    setValue('pictures', newAnimalPictures)
  }

  return {
    animalPictures,
    maxPicsWarningModalOpen,
    setMaxPicsWarningModalOpen,
    handleAnimalImageUpload,
    handleRemoveAnimalPicture,
  }
}
