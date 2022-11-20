// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

using AutoMapper;

using DAL;
using DAL.Models;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using StudentAffairsSystem.Helpers;
using StudentAffairsSystem.ViewModels;

using System;
using System.Linq;

namespace StudentAffairsSystem.Controllers
{
    [Route("api/[controller]")]
    public class StudentController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger _logger;
        private readonly IEmailSender _emailSender;


        public StudentController(IMapper mapper, IUnitOfWork unitOfWork, ILogger<CustomerController> logger, IEmailSender emailSender)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _emailSender = emailSender;
        }

        [HttpPost("CreateStudent")]
        public IActionResult CreateStudent([FromBody] StudentFormViewModel studentViewModel)
        {
            if (ModelState.IsValid)
            {


                var StudentClass = _unitOfWork.Classes.GetSingleOrDefault(c=>c.Id == studentViewModel.ClassId);
                var studentModel = this._mapper.Map<Student>(studentViewModel);
                studentModel.Class = StudentClass;
                this._unitOfWork.Stuents.Add(studentModel);
                this._unitOfWork.SaveChanges();

                return Ok();
            }
            else
            {
                return BadRequest();
            }
            
        }

        //[HttpGet("StudentList")]

        //public IActionResult StudentList()
        //{

        //    return StudentList(-1, -1,null);
        //}
        [HttpGet("StudentList/{pageNumber:int}/{pageSize:int}/{classNameFilter?}")]

        public IActionResult StudentList(int pageNumber, int pageSize, string classNameFilter =null)
        {
            IQueryable<Student> StudentQuery = null; ;
            if (classNameFilter != null)
                StudentQuery = this._unitOfWork.Stuents.Find(x => !x.IsDeleted&& x.Class.Name == classNameFilter).OrderBy(x=>x.Name);
            else
            {
                StudentQuery = this._unitOfWork.Stuents.Find(x=>!x.IsDeleted).OrderBy(x => x.Name);
            }
            var totalCount = StudentQuery.Count();
            if (pageNumber > 0 && pageSize > 0)
            {
                StudentQuery = StudentQuery.Skip((pageNumber-1) * pageSize).Take(pageSize);

            }
            var listResult = StudentQuery.ToList().Select(s=>this._mapper.Map<StudentListItemViewModel>(s)).ToList();
            ListResponse<StudentListItemViewModel> StudentList = new ListResponse<StudentListItemViewModel>() { 
            Items = listResult,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount
            };
            return Ok(StudentList);
        }

        [HttpGet("Delete/{StudentId:Guid}")]
        public IActionResult StudentList(Guid StudentId)
        {
           var student =  this._unitOfWork.Stuents.Find(x=>x.Id == StudentId).FirstOrDefault();

            if (student != null && !student.IsDeleted) {
                {
                    student.IsDeleted = true; 
                    this._unitOfWork.SaveChanges();
                
                }
            
            return Ok(StudentId);
            
            }
            else
            {
                return NotFound();
            }
        }
        [HttpGet("ClassList")]
        public IActionResult ClassList()
        {
            var classListViewModel = _unitOfWork.Classes.GetAll().Select(x=> _mapper.Map<ClassViewModel>( x)).ToList();
            return Ok(classListViewModel);
        }
    }
}
