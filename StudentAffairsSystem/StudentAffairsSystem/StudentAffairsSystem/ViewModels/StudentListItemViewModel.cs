// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

using DAL.Models;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StudentAffairsSystem.ViewModels
{
    public class StudentListItemViewModel {
        public Guid Id { get; set; }
        public string Gender { get; set; }
        [MaxLength(256)]
        public string Name { get; set; }  
        [MaxLength(500)]
        public string Photo { get; set; } 

        public Guid ClassId { get; set; }

        public string Class { get; set; }
        public static explicit operator StudentListItemViewModel(Student model)
        {
            return new StudentListItemViewModel() {  Id = model.Id , Name = model.Name , Class = model.Class.Name , ClassId = model.Id , Gender = model.Gender.ToString() , Photo = model.Photo};
        }

    }

    public class PagingDTO
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public int Take => PageSize;
        public int Skip => (Take * (PageNumber - 1));
    }
    public class ListResponse<T> where T : class
    {
        public ListResponse()
        {
            Items = new List<T>();
        }
        public List<T> Items { get; set; }
        public int TotalCount { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
