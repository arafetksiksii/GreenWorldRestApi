import Foundation

class UserViewModel: ObservableObject {
    @Published var errorMessage: String?
    @Published var successMessage: String?

    func updatePassword(userId: String, currentPassword: String, newPassword: String, confirmNewPassword: String) {
        UserService.shared.updatePassword(userId: userId, currentPassword: currentPassword, newPassword: newPassword, confirmNewPassword: confirmNewPassword) { result in
            DispatchQueue.main.async {
                switch result {
                case .success(let message):
                    self.errorMessage = nil
                    self.successMessage = message
                case .failure(let error):
                    self.successMessage = nil
                    self.errorMessage = error.localizedDescription
                }
            }
        }
    }
}
