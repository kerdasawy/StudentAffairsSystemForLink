// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

using System;
using System.ComponentModel.DataAnnotations;

namespace StudentAffairsSystem.ViewModels
{
    public class StudentFormViewModel {
       
        public Guid? Id { get; set; }
        public string Gender { get; set; }
        [MaxLength(256)]
        [Required]
        public string Name { get; set; }
        [Required]
        public DateTime BirthDate { get; set; }
        [MaxLength(500)]
        public string Adress { get; set; }
        [MaxLength(40)]
        public string Phone { get; set; }
        [MaxLength(256)]
        public string EmailAddress { get; set; }
        [MaxLength(500)]
        public string Photo { get; set; }

       
        public Guid? ClassId { get; set; }

        public string Class { get; set; }
    }
}
