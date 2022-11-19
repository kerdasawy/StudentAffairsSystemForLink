// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

using DAL.Models;

using System;

namespace StudentAffairsSystem.ViewModels
{
    public class ClassViewModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }

        public static explicit operator ClassViewModel(Class model)
        {
            return new ClassViewModel() { Id = model.Id, Name = model.Name };

        }
    }
}
