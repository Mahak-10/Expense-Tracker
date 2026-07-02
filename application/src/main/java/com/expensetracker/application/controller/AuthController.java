package com.expensetracker.application.controller;

import com.expensetracker.application.exceptions.APIException;
import com.expensetracker.application.model.*;
import com.expensetracker.application.repository.*;
import com.expensetracker.application.utils.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ScheduledOptionRepository scheduledOptionRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private SavingRepository savingRepository;

    @Autowired
    private DebtRepository debtRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private ScheduledTransactionRepository scheduledTransactionRepository;

    public static class AuthRequest {
        private String username;
        private String password;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class AuthResponse {
        private Long userId;
        private String username;
        private String message;

        public AuthResponse(Long userId, String username, String message) {
            this.userId = userId;
            this.username = username;
            this.message = message;
        }

        public Long getUserId() { return userId; }
        public String getUsername() { return username; }
        public String getMessage() { return message; }
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest request) {
        if (request.getUsername() == null || request.getUsername().trim().isEmpty() ||
            request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new APIException("Username and Password are required");
        }

        String username = request.getUsername().trim();
        if (userRepository.findByUsername(username) != null) {
            throw new APIException("Username is already taken");
        }

        User user = new User();
        user.setUsername(username);
        user.setPasswordHash(PasswordUtil.hashPassword(request.getPassword()));
        User savedUser = userRepository.save(user);

        // Seed default categories for this user
        String[] defaultCategories = {"Rent", "Bills", "Food", "Grocery", "Travel", "Stationary", "Party"};
        Category rentCat = null, billsCat = null, foodCat = null, groceryCat = null, travelCat = null, stationaryCat = null, partyCat = null;
        for (String name : defaultCategories) {
            Category category = new Category();
            category.setCategoryName(name);
            category.setUser(savedUser);
            Category savedCat = categoryRepository.save(category);
            if (name.equalsIgnoreCase("Rent")) rentCat = savedCat;
            else if (name.equalsIgnoreCase("Bills")) billsCat = savedCat;
            else if (name.equalsIgnoreCase("Food")) foodCat = savedCat;
            else if (name.equalsIgnoreCase("Grocery")) groceryCat = savedCat;
            else if (name.equalsIgnoreCase("Travel")) travelCat = savedCat;
            else if (name.equalsIgnoreCase("Stationary")) stationaryCat = savedCat;
            else if (name.equalsIgnoreCase("Party")) partyCat = savedCat;
        }

        // Seed default scheduled options for this user
        String[] defaultOptions = {"Water bill", "Electricity", "Mobile recharge", "Wifi bill", "Home loan", "Entertainment", "Transportation"};
        for (String optionName : defaultOptions) {
            ScheduledOption opt = new ScheduledOption();
            opt.setOptionName(optionName);
            opt.setUser(savedUser);
            scheduledOptionRepository.save(opt);
        }

        if (username.equalsIgnoreCase("demo_user")) {
            Category holidayCat = new Category();
            holidayCat.setCategoryName("Holiday");
            holidayCat.setUser(savedUser);
            holidayCat = categoryRepository.save(holidayCat);

            Category transportCat = new Category();
            transportCat.setCategoryName("Transport");
            transportCat.setUser(savedUser);
            transportCat = categoryRepository.save(transportCat);

            Category shoppingCat = new Category();
            shoppingCat.setCategoryName("Shopping");
            shoppingCat.setUser(savedUser);
            shoppingCat = categoryRepository.save(shoppingCat);

            Category healthCat = new Category();
            healthCat.setCategoryName("Health");
            healthCat.setUser(savedUser);
            healthCat = categoryRepository.save(healthCat);

            seedDemoUserData(savedUser, rentCat, billsCat, foodCat, groceryCat, travelCat, stationaryCat, partyCat, holidayCat, transportCat, shoppingCat, healthCat);
        }

        return new ResponseEntity<>(new AuthResponse(savedUser.getUserId(), savedUser.getUsername(), "Registration successful"), HttpStatus.CREATED);
    }

    private void seedDemoUserData(User user, Category rentCat, Category billsCat, Category foodCat, Category groceryCat, Category travelCat, Category stationaryCat, Category partyCat, Category holidayCat, Category transportCat, Category shoppingCat, Category healthCat) {
        // 1. Expenses: Summing to Rs 34,650
        Expense exp1 = new Expense();
        exp1.setAmount(12000.0);
        exp1.setDescription("House Rent");
        exp1.setDate(LocalDate.now().minusDays(10));
        exp1.setCategory(rentCat);
        exp1.setUser(user);
        expenseRepository.save(exp1);

        Expense exp2 = new Expense();
        exp2.setAmount(1000.0);
        exp2.setDescription("Vegetable & Fruits");
        exp2.setDate(LocalDate.now().minusDays(2));
        exp2.setCategory(groceryCat);
        exp2.setUser(user);
        expenseRepository.save(exp2);

        Expense exp3 = new Expense();
        exp3.setAmount(1820.0);
        exp3.setDescription("Dinner");
        exp3.setDate(LocalDate.now().minusDays(1));
        exp3.setCategory(foodCat);
        exp3.setUser(user);
        expenseRepository.save(exp3);

        Expense exp4 = new Expense();
        exp4.setAmount(2500.0);
        exp4.setDescription("Monthly Fuel");
        exp4.setDate(LocalDate.now().minusDays(5));
        exp4.setCategory(transportCat);
        exp4.setUser(user);
        expenseRepository.save(exp4);

        Expense exp5 = new Expense();
        exp5.setAmount(1850.0);
        exp5.setDescription("T-shirt");
        exp5.setDate(LocalDate.now().minusDays(1));
        exp5.setCategory(shoppingCat);
        exp5.setUser(user);
        expenseRepository.save(exp5);

        Expense exp6 = new Expense();
        exp6.setAmount(480.0);
        exp6.setDescription("Medicines");
        exp6.setDate(LocalDate.now().minusDays(3));
        exp6.setCategory(healthCat);
        exp6.setUser(user);
        expenseRepository.save(exp6);

        Expense exp7 = new Expense();
        exp7.setAmount(5000.0);
        exp7.setDescription("Hotel");
        exp7.setDate(LocalDate.now().minusDays(3));
        exp7.setCategory(holidayCat);
        exp7.setUser(user);
        expenseRepository.save(exp7);

        Expense exp8 = new Expense();
        exp8.setAmount(10000.0);
        exp8.setDescription("Tickets");
        exp8.setDate(LocalDate.now().minusDays(4));
        exp8.setCategory(holidayCat);
        exp8.setUser(user);
        expenseRepository.save(exp8);

        // 2. Subscriptions (5 items)
        Subscription sub1 = new Subscription();
        sub1.setServiceName("Netflix");
        sub1.setAmount(199.0);
        sub1.setBillingCycle("MONTHLY");
        sub1.setNextPaymentDate(LocalDate.now().plusDays(15));
        sub1.setUser(user);
        subscriptionRepository.save(sub1);

        Subscription sub2 = new Subscription();
        sub2.setServiceName("Spotify");
        sub2.setAmount(119.0);
        sub2.setBillingCycle("MONTHLY");
        sub2.setNextPaymentDate(LocalDate.now().plusDays(20));
        sub2.setUser(user);
        subscriptionRepository.save(sub2);

        Subscription sub3 = new Subscription();
        sub3.setServiceName("LinkedIn Premium");
        sub3.setAmount(1400.0);
        sub3.setBillingCycle("MONTHLY");
        sub3.setNextPaymentDate(LocalDate.now().plusDays(25));
        sub3.setUser(user);
        subscriptionRepository.save(sub3);

        Subscription sub4 = new Subscription();
        sub4.setServiceName("YouTube Premium");
        sub4.setAmount(129.0);
        sub4.setBillingCycle("MONTHLY");
        sub4.setNextPaymentDate(LocalDate.now().plusDays(5));
        sub4.setUser(user);
        subscriptionRepository.save(sub4);

        Subscription sub5 = new Subscription();
        sub5.setServiceName("Amazon Prime");
        sub5.setAmount(1499.0);
        sub5.setBillingCycle("YEARLY");
        sub5.setNextPaymentDate(LocalDate.now().plusDays(100));
        sub5.setUser(user);
        subscriptionRepository.save(sub5);

        // 3. Scheduled Transactions (5 items)
        ScheduledTransaction st1 = new ScheduledTransaction();
        st1.setName("Water Bill");
        st1.setAmount(350.0);
        st1.setDueDate(LocalDate.now().plusDays(15));
        st1.setCategoryOption("Water bill");
        st1.setStatus("PENDING");
        st1.setUser(user);
        scheduledTransactionRepository.save(st1);

        ScheduledTransaction st2 = new ScheduledTransaction();
        st2.setName("Electricity Bill");
        st2.setAmount(1450.0);
        st2.setDueDate(LocalDate.now().plusDays(6));
        st2.setCategoryOption("Electricity");
        st2.setStatus("PAID");
        st2.setUser(user);
        scheduledTransactionRepository.save(st2);

        ScheduledTransaction st3 = new ScheduledTransaction();
        st3.setName("Internet Wifi Bill");
        st3.setAmount(799.0);
        st3.setDueDate(LocalDate.now().plusDays(10));
        st3.setCategoryOption("Wifi bill");
        st3.setStatus("PENDING");
        st3.setUser(user);
        scheduledTransactionRepository.save(st3);

        ScheduledTransaction st4 = new ScheduledTransaction();
        st4.setName("Mobile recharge plan");
        st4.setAmount(499.0);
        st4.setDueDate(LocalDate.now().plusDays(28));
        st4.setCategoryOption("Mobile recharge");
        st4.setStatus("PAID");
        st4.setUser(user);
        scheduledTransactionRepository.save(st4);

        ScheduledTransaction st5 = new ScheduledTransaction();
        st5.setName("Home Rent Payment");
        st5.setAmount(12000.0);
        st5.setDueDate(LocalDate.now().plusDays(25));
        st5.setCategoryOption("Home loan");
        st5.setStatus("PENDING");
        st5.setUser(user);
        scheduledTransactionRepository.save(st5);

        // 4. Savings (3 items)
        Saving sav1 = new Saving();
        sav1.setAmount(55000.0);
        sav1.setDescription("Surplus savings corpus");
        sav1.setDate(LocalDate.now().minusMonths(1));
        sav1.setUser(user);
        savingRepository.save(sav1);

        Saving sav2 = new Saving();
        sav2.setAmount(12000.0);
        sav2.setDescription("Surplus savings bank transfer");
        sav2.setDate(LocalDate.now().minusDays(15));
        sav2.setUser(user);
        savingRepository.save(sav2);

        Saving sav3 = new Saving();
        sav3.setAmount(8000.0);
        sav3.setDescription("Bonus allocation");
        sav3.setDate(LocalDate.now().minusDays(1));
        sav3.setUser(user);
        savingRepository.save(sav3);

        // 5. Debts (2 items)
        Debt debt1 = new Debt();
        debt1.setPersonName("Alice");
        debt1.setAmount(1500.0);
        debt1.setType("OWED_TO_ME");
        debt1.setDescription("Food share");
        debt1.setDueDate(LocalDate.now().plusDays(20));
        debt1.setUser(user);
        debtRepository.save(debt1);

        Debt debt2 = new Debt();
        debt2.setPersonName("Bob");
        debt2.setAmount(500.0);
        debt2.setType("OWED_TO_OTHERS");
        debt2.setDescription("Cab ride");
        debt2.setDueDate(LocalDate.now().plusDays(15));
        debt2.setUser(user);
        debtRepository.save(debt2);
    }

    private void resetDemoUserData(User user) {
        Long userId = user.getUserId();

        // Delete previous demo entries
        expenseRepository.deleteAll(expenseRepository.findByUser_UserId(userId));
        savingRepository.deleteAll(savingRepository.findByUser_UserIdOrderByDateDesc(userId));
        debtRepository.deleteAll(debtRepository.findByUser_UserIdOrderByDueDateDesc(userId));
        subscriptionRepository.deleteAll(subscriptionRepository.findByUser_UserIdOrderByNextPaymentDateAsc(userId));
        scheduledTransactionRepository.deleteAll(scheduledTransactionRepository.findByUser_UserIdOrderByDueDateAsc(userId));
        categoryRepository.deleteAll(categoryRepository.findByUser_UserId(userId));
        scheduledOptionRepository.deleteAll(scheduledOptionRepository.findByUser_UserId(userId));

        // Re-create default categories
        String[] defaultCategories = {"Rent", "Bills", "Food", "Grocery", "Travel", "Stationary", "Party"};
        Category rentCat = null, billsCat = null, foodCat = null, groceryCat = null, travelCat = null, stationaryCat = null, partyCat = null;
        for (String name : defaultCategories) {
            Category category = new Category();
            category.setCategoryName(name);
            category.setUser(user);
            Category savedCat = categoryRepository.save(category);
            if (name.equalsIgnoreCase("Rent")) rentCat = savedCat;
            else if (name.equalsIgnoreCase("Bills")) billsCat = savedCat;
            else if (name.equalsIgnoreCase("Food")) foodCat = savedCat;
            else if (name.equalsIgnoreCase("Grocery")) groceryCat = savedCat;
            else if (name.equalsIgnoreCase("Travel")) travelCat = savedCat;
            else if (name.equalsIgnoreCase("Stationary")) stationaryCat = savedCat;
            else if (name.equalsIgnoreCase("Party")) partyCat = savedCat;
        }

        // Re-create custom categories for demo_user
        Category holidayCat = new Category();
        holidayCat.setCategoryName("Holiday");
        holidayCat.setUser(user);
        holidayCat = categoryRepository.save(holidayCat);

        Category transportCat = new Category();
        transportCat.setCategoryName("Transport");
        transportCat.setUser(user);
        transportCat = categoryRepository.save(transportCat);

        Category shoppingCat = new Category();
        shoppingCat.setCategoryName("Shopping");
        shoppingCat.setUser(user);
        shoppingCat = categoryRepository.save(shoppingCat);

        Category healthCat = new Category();
        healthCat.setCategoryName("Health");
        healthCat.setUser(user);
        healthCat = categoryRepository.save(healthCat);

        // Re-create default scheduled options
        String[] defaultOptions = {"Water bill", "Electricity", "Mobile recharge", "Wifi bill", "Home loan", "Entertainment", "Transportation"};
        for (String optionName : defaultOptions) {
            ScheduledOption opt = new ScheduledOption();
            opt.setOptionName(optionName);
            opt.setUser(user);
            scheduledOptionRepository.save(opt);
        }

        // Re-seed demo database
        seedDemoUserData(user, rentCat, billsCat, foodCat, groceryCat, travelCat, stationaryCat, partyCat, holidayCat, transportCat, shoppingCat, healthCat);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        if (request.getUsername() == null || request.getUsername().trim().isEmpty() ||
            request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new APIException("Username and Password are required");
        }

        User user = userRepository.findByUsername(request.getUsername().trim());
        if (user == null || !user.getPasswordHash().equals(PasswordUtil.hashPassword(request.getPassword()))) {
            throw new APIException("Invalid username or password");
        }

        if (user.getUsername().equalsIgnoreCase("demo_user")) {
            resetDemoUserData(user);
        }

        return new ResponseEntity<>(new AuthResponse(user.getUserId(), user.getUsername(), "Login successful"), HttpStatus.OK);
    }

    @PutMapping("/update-profile")
    public ResponseEntity<AuthResponse> updateProfile(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody AuthRequest request) {
        if (userId == null) {
            throw new com.expensetracker.application.exceptions.APIException("Unauthorized status: X-User-Id header missing");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new com.expensetracker.application.exceptions.ResourceNotFoundException("User", "userId", userId));

        if (request.getUsername() != null && !request.getUsername().trim().isEmpty()) {
            String newUsername = request.getUsername().trim();
            User existing = userRepository.findByUsername(newUsername);
            if (existing != null && !existing.getUserId().equals(userId)) {
                throw new com.expensetracker.application.exceptions.APIException("Username is already taken by another user");
            }
            user.setUsername(newUsername);
        }

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPasswordHash(PasswordUtil.hashPassword(request.getPassword()));
        }

        User saved = userRepository.save(user);
        return new ResponseEntity<>(new AuthResponse(saved.getUserId(), saved.getUsername(), "Profile updated successfully"), HttpStatus.OK);
    }
}
