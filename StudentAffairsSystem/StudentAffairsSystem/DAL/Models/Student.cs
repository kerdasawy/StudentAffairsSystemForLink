// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

using DAL.Core;

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DAL.Models
{
    [Table(nameof(Student))]
    public class Student : AuditableEntity
    {
        [Key]
        public Guid StudnetId { get; set; }
        public Gender Gender { get; set; }
        [MaxLength(256)]
        public string Name { get; set; }

        public DateTime BirthDate { get; set; }
        [MaxLength(500)]
        public string Adress { get; set; }
        [MaxLength(40)]
        public string Phone { get; set; }
        [MaxLength(256)]
        public string EmailAddress { get; set; }
        [MaxLength(500)]
        public string Photo { get; set; }

        [ForeignKey(nameof(Class))]
        public Guid ClassId { get; set; }

        public virtual  Class Class { get; set; }

    }


}
