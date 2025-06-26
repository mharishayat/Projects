#include <iostream>
#include <vector>
#include <string>
#include <limits>
using namespace std;

struct Patient {
    string name;
    int age;
    string condition;
};

vector<Patient> patients; // Store patients in a vector

void addPatient() {
    Patient newPatient;
    cin.ignore(); // Ignore leftover newline from previous input

    cout << "Enter patient's name: ";
    getline(cin, newPatient.name);

    cout << "Enter patient's age: ";
    while (!(cin >> newPatient.age)) {
        cout << "Invalid input. Please enter a number for age: ";
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
    }
    cin.ignore(); // Ignore leftover newline

    cout << "Enter patient's condition: ";
    getline(cin, newPatient.condition);

    patients.push_back(newPatient);
    cout << "Patient added successfully!\n";
}

void displayPatients() {
    cout << "List of Patients:\n";
    for (const auto &patient : patients) {
        cout << "Name: " << patient.name << ", Age: " << patient.age << ", Condition: " << patient.condition << "\n";
    }
}

void searchPatientByName(const std::string &name) 
{
    cout << "Patients with name '" << name << "':\n";
    for (const auto &patient : patients) 
	{
        if (patient.name == name) 
		{
            cout << "Name: " << patient.name << ", Age: " << patient.age << ", Condition: " << patient.condition << "\n";
        }
    }
}

void searchPatientByCondition(const std::string &condition) 
{
    cout << "Patients with condition '" << condition << "':\n";
    for (const auto &patient : patients) 
	{
        if (patient.condition == condition) 
		{
            cout << "Name: " << patient.name << ", Age: " << patient.age << ", Condition: " << patient.condition << "\n";
        }
    }
}

void countPatients() 
{
    cout << "Total number of patients: " << patients.size() << "\n";
}

int main() 
{
    int choice;
    do 
	{
        cout << "\nHospital Management System\n";
        cout << "1. Add New Patient\n";
        cout << "2. Display Patients\n";
        cout << "3. Search Patient by Name\n";
        cout << "4. Search Patient by Condition\n";
        cout << "5. Count Patients\n";
        cout << "6. Exit\n";
        cout << "Enter your choice: ";
        cin >> choice;

        switch (choice) 
		{
            case 1:
                addPatient();
                break;
            case 2:
                displayPatients();
                break;
            case 3: 
			{
                string name;
                cout << "Enter name to search: ";
                cin >> name;
                searchPatientByName(name);
                break;
            }
            case 4: 
			{
                string condition;
                cout << "Enter condition to search: ";
                cin >> condition;
                searchPatientByCondition(condition);
                break;
            }
            case 5:
                countPatients();
                break;
            case 6:
                cout << "Exiting...\n";
                break;
            default:
                cout << "Invalid choice. Try again.\n";
        }
    } while (choice != 6);

    return 0;
}
